export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    readTime: string;
    image?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "miert-fontos-az-automatizacio",
        title: "Miért fontos az automatizáció KKV-knál?",
        excerpt: "Az idő pénz. Mutatjuk, hogyan spórolhatsz havi 40 órát egyszerű scriptekkel.",
        content: `
## Miért éri meg automatizálni?

A legtöbb kisvállalkozás tulajdonosa napi szinten küzd az időhiánnyal. Adminisztráció, számlázás, ügyfélkezelés, marketing... a lista végtelen. De mi lenne, ha ezeknek a feladatoknak a felét egy robot végezné el helyetted?

### 1. Időmegtakarítás
Egy egyszerű e-mail automatizáció, ami azonnal válaszol az érdeklődőknek, heti több órát spórolhat meg. Nem kell minden egyes levélre manuálisan válaszolni, a rendszer teszi a dolgát 24/7.

### 2. Hibák csökkentése
Az emberek fáradnak, hibáznak. Egy script sosem felejt el csatolmányt küldeni, vagy rossz összeget írni a számlára. A folyamatok standardizálása növeli a megbízhatóságot.

### 3. Skálázhatóság
Ha hirtelen 10 helyett 100 megrendelésed érkezik naponta, manuálisan összeomlana a rendszer. Az automatizáció viszont észre sem veszi a különbséget.

## Hol kezdd el?

Nem kell rögtön mindent automatizálni. Kezdd a legfájdalmasabb pontokkal:
- Számlázás összekötése a webshoppal
- Automatikus válasz e-mailek
- Közösségi média posztok időzítése

Ha segítségre van szükséged, keress minket bizalommal!
        `,
        date: "2023. Okt. 15.",
        category: "Automatizáció",
        readTime: "5 perc"
    },
    {
        slug: "10-egyszeru-wp-script",
        title: "10 egyszerű WP-s script, amit telepíthetsz ma",
        excerpt: "Gyorsítsd fel WordPress oldaladat és automatizáld a karbantartást ezekkel a kódokkal.",
        content: `
## WordPress Automatizáció

A WordPress a világ legnépszerűbb CMS rendszere, de karbantartása időigényes lehet. Íme néhány tipp, hogyan könnyítheted meg az életed.

### 1. Automatikus frissítések
A \`wp-config.php\` fájlban beállíthatod, hogy a rendszer automatikusan telepítse a biztonsági frissítéseket. Ezzel megvédheted az oldaladat a leggyakoribb támadásoktól.

### 2. Képek optimalizálása
Használj olyan plugint vagy scriptet, ami feltöltéskor automatikusan tömöríti a képeket. Ez drasztikusan javítja az oldal betöltési sebességét.

### 3. Adatbázis tisztítás
A WordPress rengeteg szemetet tárol (post revisions, spam kommentek). Egy egyszerű cron job segítségével hetente kitakaríthatod az adatbázist, hogy gyors maradjon az oldal.

*(A teljes script gyűjteményt a Lead Magnet csomagunkban találod!)*
        `,
        date: "2023. Okt. 10.",
        category: "WordPress",
        readTime: "8 perc"
    },
    {
        slug: "webshop-szamlazo-integracio",
        title: "Hogyan integráld a webshopodat a számlázóval",
        excerpt: "Lépésről lépésre útmutató WooCommerce és Számlázz.hu összekötéséhez.",
        content: `
## Webshop és Számlázó: A tökéletes páros

Még mindig kézzel állítod ki a számlákat minden rendelés után? Itt az ideje váltani!

### Miért integráld?
- **Azonnali számlázás:** A vevő a vásárlás után azonnal megkapja a számlát.
- **NAV megfelelőség:** A modern számlázó programok automatikusan beküldik az adatokat a NAV-nak.
- **Kevesebb adminisztráció:** Neked csak a rendelések teljesítésével kell foglalkoznod.

### Hogyan működik?
A legtöbb számlázó program (Számlázz.hu, Billingo) rendelkezik kész WooCommerce bővítménnyel.
1. Regisztrálj a számlázó szolgáltatónál.
2. Generálj egy API kulcsot.
3. Telepítsd a bővítményt a WordPress-ben.
4. Másold be az API kulcsot.
5. Kész!

Innertől kezdve minden automatikusan történik.
        `,
        date: "2023. Szept. 28.",
        category: "E-kereskedelem",
        readTime: "12 perc"
    },
    {
        slug: "wordpress-biztonsag-alapok",
        title: "Hogyan védjem a WordPress oldalam?",
        excerpt: "Alapvető biztonsági beállítások, amiket minden tulajdonosnak ismernie kell.",
        content: `
## WordPress Biztonság 101

A WordPress népszerűsége miatt gyakori célpontja a hackereknek. De ne ess pánikba, néhány egyszerű lépéssel megvédheted az oldaladat.

### 1. Erős jelszavak
Ez alapnak tűnik, de még mindig a leggyakoribb hiba. Használj jelszókezelőt és kétfaktoros hitelesítést (2FA)!

### 2. Rendszeres mentés
Ha mégis megtörténik a baj, az egyetlen mentsvárad a biztonsági mentés. Állíts be automatikus napi mentést egy külső tárhelyre (pl. Google Drive, AWS S3).

### 3. Tűzfal (WAF)
Használj biztonsági plugint (pl. Wordfence) vagy szolgáltatást (Cloudflare), ami kiszűri a gyanús forgalmat még mielőtt elérné a szerveredet.

### 4. Frissítések
Mindig tartsd naprakészen a WordPress-t, a témákat és a plugineket. A frissítések gyakran tartalmaznak biztonsági javításokat.
        `,
        date: "2023. Szept. 15.",
        category: "Biztonság",
        readTime: "6 perc"
    }
];
