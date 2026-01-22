# Aktuális Projekt Állapot - 2026. 01. 22.

## Technikai Stack
- **Framework:** Next.js 16.0.8 (App Router)
- **Runtime:** Node.js (Edge runtime az OG képeknél)
- **Auth:** NextAuth.js (v5 beta) - GitHub & Credentials
- **Adatbázis:** Prisma + PostgreSQL (Neon/Vercel)
- **I18n:** next-intl (hu/en támogatás)

## Legutóbbi fontos módosítások
1. **Middleware Migráció:** A `src/middleware.ts` átnevezve `src/proxy.ts`-re a Next.js 16 konvenció szerint.
2. **Discord Integráció:** GitHub Webhook setupolva a Discord értesítésekhez (ingyenes megoldás a Vercel Webhook helyett).
3. **✅ IT Infrastruktúra Szolgáltatások:** Az `IT_INFRASTRUCTURE_PLAN.md` alapján implementálva:
   - Új szolgáltatási pillérek (Virtualizáció, Hálózat, Szerverüzemeltetés, Adatbiztonság)
   - ServicePillars komponens (`src/components/sections/service-pillars.tsx`)
   - InfraTechStack komponens (`src/components/sections/infra-tech-stack.tsx`)
   - Fordítások hozzáadva (hu.json, en.json)
   - `/szolgaltatasok/rendszeruzemeltetes` oldal frissítve az új szekciókkal
4. **reCAPTCHA Javítás:** A booking form reCAPTCHA hibák kezelése javítva, fejlesztői módozatban engedékenyebb validáció.

## Ismert jelenségek
- A Vercel build során az "Edge runtime disables static generation" figyelmeztetés az OG képgenerálás miatt jelenik meg, ez szándékos.
