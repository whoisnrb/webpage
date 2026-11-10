import Redis from "ioredis";

// Globális singleton a fejlesztési környezethez (hot-reload megelőzésére)
const globalForRedis = global as unknown as { redisClient: Redis | null };

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;
  if (globalForRedis.redisClient) return globalForRedis.redisClient;

  const redisHost = process.env.REDIS_HOST;
  const redisPort = parseInt(process.env.REDIS_PORT || "10000", 10);
  const redisPassword = process.env.REDIS_PASSWORD;
  const redisUrl = process.env.REDIS_URL;

  // Ha nincs beállítva Redis kapcsolat, csendben fallback üzemmódba áll
  if (!redisUrl && !redisHost) {
    return null;
  }

  try {
    if (redisUrl) {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
        lazyConnect: true,
      });
    } else {
      redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        tls: process.env.REDIS_TLS === "false" ? undefined : {}, // Azure Redis TLS kötelező
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
        lazyConnect: true,
      });
    }

    redis.on("error", (err) => {
      console.warn("[Azure Redis] Figyelmeztetés, Redis nem elérhető:", err.message);
    });

    if (process.env.NODE_ENV !== "production") {
      globalForRedis.redisClient = redis;
    }

    return redis;
  } catch (err) {
    console.warn("[Azure Redis] Nem sikerült inicializálni a klienst:", err);
    return null;
  }
}

/**
 * Lekéri az értéket a Redisből JSON-ként deszerializálva.
 */
export async function redisGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Elmenti az értéket a Redisbe megadott lejárati idővel (TTL másodpercben).
 */
export async function redisSet(
  key: string,
  value: any,
  ttlSeconds: number = 300
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await client.set(key, serialized, "EX", ttlSeconds);
    } else {
      await client.set(key, serialized);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Töröl egy vagy több kulcsot a Redisből.
 */
export async function redisDel(...keys: string[]): Promise<boolean> {
  const client = getRedisClient();
  if (!client || keys.length === 0) return false;

  try {
    await client.del(...keys);
    return true;
  } catch {
    return false;
  }
}

/**
 * Törli az összes megadott mintára illeszkedő kulcsot a Redisből (pl. "products:*").
 */
export async function redisDelPattern(pattern: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Okos gyorsítótárazó segédfüggvény:
 * Ha a kulcs benne van a Redisben, onnan adja vissza.
 * Ha nincs (vagy Redis hiba van), meghívja a `fetcher` függvényt, elmenti a gyorsítótárba és visszaadja.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cachedVal = await redisGet<T>(key);
  if (cachedVal !== null && cachedVal !== undefined) {
    return cachedVal;
  }

  const fresh = await fetcher();
  if (fresh !== null && fresh !== undefined) {
    // Aszinkron háttérben mentjük a Redisbe, nem blokkoljuk a választ
    redisSet(key, fresh, ttlSeconds).catch(() => {});
  }

  return fresh;
}
