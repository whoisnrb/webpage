import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
    {
        name: "WooCommerce Számlázz.hu Integráció",
        description: "Automatikus számlakiállítás minden rendelés után. Kezeli az előlegszámlákat és a sztornókat is.",
        longDescription: "Ez a bővítmény teljes körű megoldást nyújt a WooCommerce webáruházad és a Számlázz.hu összekötésére. Nem kell többé kézzel számláznod! A rendszer automatikusan figyeli a rendelések állapotát, és a megfelelő státuszváltáskor (pl. Fizetve) kiállítja és elküldi a számlát a vevőnek.",
        price: 14990,
        category: "WordPress Plugin",
        slug: "woocommerce-szamlazz-hu",
        image: "/images/products/woocommerce-szamlazz.jpg",
        features: JSON.stringify([
            "Automatikus díjbekérő és végszámla",
            "Sztornó számla kezelés visszatérítéskor",
            "Több adókulcs támogatása (AAM, 27%, 5%)",
            "OSS (One Stop Shop) kompatibilis",
            "E-számla és papír alapú számla támogatás"
        ]),
        prices: JSON.stringify({
            personal: 14990,
            commercial: 24990,
            developer: 59990
        })
    },
    {
        name: "n8n Lead Management Workflow",
        description: "Komplex workflow, ami a beérkező leadeket validálja, gazdagítja és beírja a CRM-be.",
        longDescription: "Automatizáld a lead kezelést ezzel a kész n8n workflow-val. A rendszer fogadja az adatokat a weboldaladról, ellenőrzi az email cím valódiságát, kiegészíti a cégadatokat nyilvános adatbázisokból, majd létrehozza a rekordot a CRM-edben (HubSpot, Pipedrive, Salesforce).",
        price: 24990,
        category: "Automatizáció",
        slug: "n8n-lead-management",
        image: "/images/products/n8n-workflow.jpg",
        features: JSON.stringify([
            "Email validáció",
            "Cégadat gazdagítás (Clearbit/Apollo)",
            "CRM integráció",
            "Slack/Teams értesítés",
            "Duplikáció szűrés"
        ]),
        prices: JSON.stringify({
            personal: 24990,
            commercial: 44990,
            developer: 89990
        })
    },
    {
        name: "Python Web Scraper Starter Kit",
        description: "Előre megírt osztályok és függvények webes adatgyűjtéshez. Proxy kezelés, user-agent rotálás.",
        longDescription: "Kezdj el adatot gyűjteni percek alatt. Ez a csomag tartalmazza a leggyakoribb scraping feladatokhoz szükséges kódokat: dinamikus oldalak kezelése (Selenium/Playwright), anti-bot védelem megkerülése, adatok tisztítása és mentése CSV/JSON/Database formátumba.",
        price: 11990,
        category: "Script",
        slug: "python-web-scraper",
        image: "/images/products/python-scraper.jpg",
        features: JSON.stringify([
            "Proxy rotálás támogatás",
            "User-Agent hamisítás",
            "Captcha kezelés alapok",
            "Aszinkron letöltés (aiohttp)",
            "Adatbázis konnektorok"
        ]),
        prices: JSON.stringify({
            personal: 11990,
            commercial: 19990,
            developer: 44990
        })
    },
    {
        name: "Biztonsági Audit Checklist",
        description: "Részletes PDF és Excel tábla 100+ ellenőrzési ponttal weboldalak biztonsági átvilágításához.",
        longDescription: "Ne hagyd, hogy feltörjék az oldaladat. Ez a lista végigvezet a legfontosabb biztonsági beállításokon, a szerver konfigurációtól a kód szintű sérülékenységekig. Ideális fejlesztőknek és üzemeltetőknek.",
        price: 4990,
        category: "E-book",
        slug: "security-audit-checklist",
        image: "/images/products/security-audit.jpg",
        features: JSON.stringify([
            "OWASP Top 10 lefedettség",
            "WordPress specifikus ellenőrzések",
            "Szerver hardening tippek",
            "GDPR megfelelőségi pontok",
            "Excel munkalap az auditáláshoz"
        ]),
        prices: JSON.stringify({
            personal: 4990,
            commercial: 14990,
            developer: 24990
        })
    },
    {
        name: "Next.js SaaS Boilerplate",
        description: "Indítsd el a saját szoftver szolgáltatásodat napok alatt. Auth, Stripe, Dashboard előre beállítva.",
        longDescription: "A leggyorsabb út az ötlettől a bevételig. Ez a boilerplate tartalmaz mindent, ami egy modern SaaS-hoz kell: hitelesítés (NextAuth), fizetés (Stripe/SimplePay), adatbázis (Prisma), UI komponensek (shadcn/ui) és admin felület.",
        price: 44990,
        category: "Template",
        slug: "nextjs-saas-boilerplate",
        image: "/images/products/saas-boilerplate.jpg",
        features: JSON.stringify([
            "Next.js 14 App Router",
            "Authentication & User Management",
            "Subscription Payments",
            "Admin Dashboard",
            "Email küldés (Resend)"
        ]),
        prices: JSON.stringify({
            personal: 44990,
            commercial: 84990,
            developer: 149990
        })
    }
]

async function main() {
    console.log('Start seeding products...')
    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: p,
            create: p,
        })
        console.log(`Created product with id: ${product.id}`)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
