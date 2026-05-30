import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const services = [
    {
        name: "Scriptek és Automatizáció",
        nameEn: "Scripts & Automation",
        slug: "scriptek",
        description: "Egyedi Python scriptek és automatizációs megoldások, amelyek felgyorsítják a munkafolyamataidat és csökkentik a manuális munkát.",
        descriptionEn: "Custom Python scripts and automation solutions that speed up your workflows and reduce manual labor.",
        price: 50000,
        icon: "Code2",
        href: "/szolgaltatasok/scriptek",
        features: JSON.stringify([
            "Egyedi Python scriptek fejlesztése",
            "Munkafolyamat automatizálás",
            "API integrációk",
            "Adatfeldolgozás és elemzés"
        ]),
        featuresEn: JSON.stringify([
            "Custom Python script development",
            "Workflow automation",
            "API integrations",
            "Data processing and analysis"
        ]),
        active: true,
        sortOrder: 0,
    },
    {
        name: "Webfejlesztés",
        nameEn: "Web Development",
        slug: "webfejlesztes",
        description: "Modern, reszponzív weboldalak és webalkalmazások fejlesztése a legújabb technológiákkal.",
        descriptionEn: "Modern, responsive websites and web applications built with the latest technologies.",
        price: 150000,
        icon: "ShoppingCart",
        href: "/szolgaltatasok/webfejlesztes",
        features: JSON.stringify([
            "Modern, reszponzív design",
            "Next.js / React alapú fejlesztés",
            "SEO optimalizáció",
            "Teljes e-commerce megoldások"
        ]),
        featuresEn: JSON.stringify([
            "Modern, responsive design",
            "Next.js / React development",
            "SEO optimization",
            "Full e-commerce solutions"
        ]),
        active: true,
        sortOrder: 1,
    },
    {
        name: "Rendszerüzemeltetés",
        nameEn: "System Administration",
        slug: "rendszeruzemeltetes",
        description: "Professzionális szerverüzemeltetés, virtualizáció és felhőmegoldások az Ön infrastruktúrájához.",
        descriptionEn: "Professional server management, virtualization and cloud solutions for your infrastructure.",
        price: 0,
        icon: "Server",
        href: "/szolgaltatasok/rendszeruzemeltetes",
        features: JSON.stringify([
            "Virtualizáció és felhőmegoldások",
            "Szerverfelügyelet és karbantartás",
            "24/7 monitoring",
            "Katasztrófa-helyreállítás"
        ]),
        featuresEn: JSON.stringify([
            "Virtualization and cloud solutions",
            "Server management and maintenance",
            "24/7 monitoring",
            "Disaster recovery"
        ]),
        active: true,
        sortOrder: 2,
    },
    {
        name: "Biztonság",
        nameEn: "Security",
        slug: "biztonsag",
        description: "IT biztonsági audit, penetrációs tesztelés és adatvédelmi megoldások vállalkozásod számára.",
        descriptionEn: "IT security audit, penetration testing and data protection solutions for your business.",
        price: 80000,
        icon: "Shield",
        href: "/szolgaltatasok/biztonsag",
        features: JSON.stringify([
            "Biztonsági audit és tanácsadás",
            "Penetrációs tesztelés",
            "Adatvédelem és GDPR",
            "Incidenskezelés"
        ]),
        featuresEn: JSON.stringify([
            "Security audit and consulting",
            "Penetration testing",
            "Data protection and GDPR",
            "Incident management"
        ]),
        active: true,
        sortOrder: 3,
    },
    {
        name: "Hálózat",
        nameEn: "Network",
        slug: "halozat",
        description: "Professzionális hálózati infrastruktúra tervezés, kivitelezés és karbantartás.",
        descriptionEn: "Professional network infrastructure design, implementation and maintenance.",
        price: 0,
        icon: "Server",
        href: "/szolgaltatasok/halozat",
        features: JSON.stringify([
            "Hálózattervezés és kivitelezés",
            "VPN és távoli hozzáférés",
            "WiFi optimalizálás",
            "Hálózatbiztonság"
        ]),
        featuresEn: JSON.stringify([
            "Network design and implementation",
            "VPN and remote access",
            "WiFi optimization",
            "Network security"
        ]),
        active: true,
        sortOrder: 4,
    },
    {
        name: "WordPress & WooCommerce Karbantartás",
        nameEn: "WordPress & WooCommerce Maintenance",
        slug: "wordpress-woocommerce-karbantartas",
        description: "Biztonságos, gyors és mindig elérhető WordPress weboldalak és WooCommerce webshopok folyamatos karbantartása.",
        descriptionEn: "Secure, fast, and always online WordPress websites and WooCommerce stores managed and supported monthly.",
        price: 15000,
        icon: "Globe",
        href: "/szolgaltatasok/wordpress-woocommerce-karbantartas",
        features: JSON.stringify([
            "Rendszeres frissítések",
            "Biztonsági mentések",
            "Sebesség optimalizálás",
            "Hiba javítás & Support"
        ]),
        featuresEn: JSON.stringify([
            "Regular core & plugin updates",
            "Daily automated backups",
            "Real-time security shielding",
            "Performance optimization"
        ]),
        active: true,
        sortOrder: 5,
    },
    {
        name: "KKV IT Audit & Digitális Felmérés",
        nameEn: "SMB IT Audit & Digital Health Check",
        slug: "kkv-it-audit",
        description: "Vállalkozásod teljes informatikai infrastruktúrájának és biztonságának átvilágítása, konkrét cselekvési tervvel.",
        descriptionEn: "A comprehensive review of your business's IT infrastructure, cloud setups, and security, with a concrete action roadmap.",
        price: 75000,
        icon: "Search",
        href: "/szolgaltatasok/kkv-it-audit",
        features: JSON.stringify([
            "Biztonsági átvilágítás",
            "Szoftver licenc audit",
            "Hálózati diagnosztika",
            "Digitalizációs javaslatok"
        ]),
        featuresEn: JSON.stringify([
            "Security vulnerability scan",
            "Software license & subscription audit",
            "Network health diagnostics",
            "Digital transformation roadmap"
        ]),
        active: true,
        sortOrder: 6,
    },
    {
        name: "Webshop Automatizáció",
        nameEn: "E-commerce & Webshop Automation",
        slug: "webshop-automatizacio",
        description: "Kössük össze webshopodat a számlázóddal, futárszolgálatoddal vagy CRM rendszereddel az emberi hibák kiküszöbölésére.",
        descriptionEn: "Connect your WooCommerce or Shopify store to billing portals, shipping carriers, and CRM software to eliminate human errors.",
        price: 120000,
        icon: "RefreshCw",
        href: "/szolgaltatasok/webshop-automatizacio",
        features: JSON.stringify([
            "Számlázó összekötés",
            "Futárszolgálat integráció",
            "Készlet szinkronizálás",
            "Automata értesítések"
        ]),
        featuresEn: JSON.stringify([
            "Automated invoicing",
            "Courier & shipping integration",
            "Real-time stock sync",
            "Automated tracking notifications"
        ]),
        active: true,
        sortOrder: 7,
    },
    {
        name: "AI Asszisztensek & Üzleti Automatizáció",
        nameEn: "AI Assistants & Business Automation",
        slug: "ai-asszisztensek",
        description: "Növeld hatékonyságodat mesterséges intelligenciával. Egyedi AI chatbotok és intelligens munkafolyamatok bevezetése.",
        descriptionEn: "Boost organizational productivity using tailored AI tools, automated customer service bots, and intelligent data extraction.",
        price: 150000,
        icon: "Cpu",
        href: "/szolgaltatasok/ai-asszisztensek",
        features: JSON.stringify([
            "Belső AI asszisztensek",
            "Ügyfélszolgálati chatbot",
            "Intelligens dokumentum-elemzés",
            "Automatizált munkafolyamatok"
        ]),
        featuresEn: JSON.stringify([
            "Internal RAG AI assistant",
            "Customer service web bot",
            "Intelligent document parsing",
            "Automated workflow pipelines"
        ]),
        active: true,
        sortOrder: 8,
    },
    {
        name: "Microsoft 365 & Google Workspace",
        nameEn: "Microsoft 365 & Google Workspace Setup",
        slug: "microsoft-365-google-workspace",
        description: "Profi céges felhő környezet kiépítése, e-mail migráció, jogosultságok beállítása és biztonsági mentés.",
        descriptionEn: "Professional business cloud workspace setup, secure email migration, folder access structures, and MFA setup.",
        price: 85000,
        icon: "Cloud",
        href: "/szolgaltatasok/microsoft-365-google-workspace",
        features: JSON.stringify([
            "E-mail fiókok migrációja",
            "Jogosultságkezelés beállítása",
            "Csapatmunka támogatás",
            "Felhő alapú adatvédelem"
        ]),
        featuresEn: JSON.stringify([
            "Secure email migration",
            "Role-based file access design",
            "Team collaboration tools setup",
            "Cloud threat protection & MFA"
        ]),
        active: true,
        sortOrder: 9,
    },
    {
        name: "Backup & Adatmentési Stratégia",
        nameEn: "Backup & Disaster Recovery Strategy",
        slug: "backup-adatmentes",
        description: "Védd meg vállalkozásod adatait a zsarolóvírusoktól és adatvesztéstől a 3-2-1 mentési szabály szerint.",
        descriptionEn: "Protect your company files and customer databases from ransomware, theft, and hardware failure using the 3-2-1 backup rule.",
        price: 10000,
        icon: "Database",
        href: "/szolgaltatasok/backup-adatmentes",
        features: JSON.stringify([
            "Automatikus mentési rend",
            "Zsarolóvírus-védelem",
            "Hibrid felhő mentések",
            "Katasztrófa helyreállítási terv"
        ]),
        featuresEn: JSON.stringify([
            "Automated daily backup routine",
            "Ransomware immutable backups",
            "Hybrid local & cloud backups",
            "Disaster recovery planning"
        ]),
        active: true,
        sortOrder: 10,
    },
    {
        name: "Havidíjas Rendszergazda & Managed IT",
        nameEn: "Managed IT & Dedicated Sysadmin",
        slug: "havidijas-rendszergazda",
        description: "Teljes körű rendszerfelügyelet, proaktív karbantartás és gyors helpdesk támogatás havidíjas konstrukcióban.",
        descriptionEn: "End-to-end server management, network monitoring, and rapid remote user helpdesk under a predictable monthly plan.",
        price: 39000,
        icon: "Activity",
        href: "/szolgaltatasok/havidijas-rendszergazda",
        features: JSON.stringify([
            "Proaktív szerverfelügyelet",
            "Munkaállomások karbantartása",
            "24/7 Monitoring & Riasztás",
            "Dedikált IT support"
        ]),
        featuresEn: JSON.stringify([
            "Proactive server & network monitoring",
            "Workstation maintenance & patch management",
            "24/7 Threat alerts & diagnostics",
            "Dedicated technical helpdesk"
        ]),
        active: true,
        sortOrder: 11,
    },
    {
        name: "Felhő Migráció és Költségoptimalizálás",
        nameEn: "Cloud Migration & Cost Optimization",
        slug: "felho-migracio-koltsegoptimalizalas",
        description: "Céges e-mailek, fájlok, szerverek és üzleti rendszerek biztonságos költöztetése modern felhőalapú környezetbe, felesleges költségek csökkentésével.",
        descriptionEn: "Secure migration of business email, files, servers and systems to modern cloud environments with cost optimization.",
        price: 190000,
        icon: "Cloud",
        href: "/szolgaltatasok/felho-migracio-koltsegoptimalizalas",
        features: JSON.stringify([
            "Céges e-mail migráció",
            "Biztonságos fájl és adat költöztetés",
            "Felhő költségoptimalizálás",
            "Hozzáférés és jogosultságkezelés"
        ]),
        featuresEn: JSON.stringify([
            "Business email migration",
            "Secure file & data migration",
            "Cloud cost optimization",
            "Access & permission setup"
        ]),
        active: true,
        sortOrder: 12,
    },
    {
        name: "AI Ügyfélszolgálat Weboldalra",
        nameEn: "AI Customer Support Chatbot",
        slug: "ai-ugyfelszolgalat-weboldalra",
        description: "AI chatbot, amely válaszol a gyakori kérdésekre, előszűri az ajánlatkéréseket, támogatja az ügyfélszolgálatot és CRM-be vagy e-mailbe továbbítja a leadeket.",
        descriptionEn: "AI chatbot that answers frequent questions, qualifies leads, supports customer service and forwards enquiries to CRM or email.",
        price: 390000,
        icon: "Cpu",
        href: "/szolgaltatasok/ai-ugyfelszolgalat-weboldalra",
        features: JSON.stringify([
            "24/7 AI chatbot weboldalra",
            "Intelligens lead előszűrés",
            "CRM és e-mail integrációk",
            "Többnyelvű válaszadás"
        ]),
        featuresEn: JSON.stringify([
            "24/7 AI chatbot on website",
            "Intelligent lead qualification",
            "CRM & email integrations",
            "Multilingual response support"
        ]),
        active: true,
        sortOrder: 13,
    },
    {
        name: "CRM és Lead Automatizáció",
        nameEn: "CRM & Lead Automation",
        slug: "crm-lead-automatizacio",
        description: "Értékesítési folyamatok, ajánlatkérések, ügyféladatok és utánkövetések automatizálása modern CRM rendszerekkel.",
        descriptionEn: "Automation of sales processes, enquiries, customer data and follow-ups with modern CRM systems.",
        price: 290000,
        icon: "Puzzle",
        href: "/szolgaltatasok/crm-lead-automatizacio",
        features: JSON.stringify([
            "Értékesítési tölcsérek (pipelines)",
            "Automatikus lead- és ajánlatkezelés",
            "Weboldal lead form integráció",
            "Automatikus utánkövetés (follow-ups)"
        ]),
        featuresEn: JSON.stringify([
            "Sales funnel (pipelines) setup",
            "Automated lead & quote tracking",
            "Website lead form integration",
            "Automated follow-up workflows"
        ]),
        active: true,
        sortOrder: 14,
    },
    {
        name: "Webshop Mérés és Konverzió Növelés",
        nameEn: "Ecommerce Tracking & Conversion Optimization",
        slug: "webshop-meres-konverzio-noveles",
        description: "GA4, Google Tag Manager, Meta Pixel, konverziómérés, kosárelhagyás és riportok beállítása webshopoknak és szolgáltató weboldalaknak.",
        descriptionEn: "GA4, Google Tag Manager, Meta Pixel, conversion tracking, cart abandonment and reporting setup for ecommerce and service websites.",
        price: 180000,
        icon: "Activity",
        href: "/szolgaltatasok/webshop-meres-konverzio-noveles",
        features: JSON.stringify([
            "GA4 és GTM teljes körű beállítás",
            "Kosárelhagyás és vásárlási tölcsér mérés",
            "Meta Pixel és hirdetési pixelek",
            "Google Ads konverziókövetés"
        ]),
        featuresEn: JSON.stringify([
            "Full GA4 & GTM configuration",
            "Cart abandonment & purchase funnel",
            "Meta Pixel & marketing pixels setup",
            "Google Ads conversion tracking"
        ]),
        active: true,
        sortOrder: 15,
    },
    {
        name: "Üzleti Dashboardok és Automatizált Riportok",
        nameEn: "Business Dashboards & Automated Reports",
        slug: "uzleti-dashboardok-riportok",
        description: "Power BI vagy Looker Studio dashboardok értékesítéshez, marketinghez, pénzügyhöz, készlethez és vezetői döntéstámogatáshoz.",
        descriptionEn: "Power BI or Looker Studio dashboards for sales, marketing, finance, inventory and management decision-making.",
        price: 240000,
        icon: "Layout",
        href: "/szolgaltatasok/uzleti-dashboardok-riportok",
        features: JSON.stringify([
            "Looker Studio és Power BI riportok",
            "Több adatforrás összekapcsolása",
            "Vezetői KPI-ok és vizualizáció",
            "Automatikus frissítés és riportküldés"
        ]),
        featuresEn: JSON.stringify([
            "Looker Studio & Power BI reports",
            "Multi-source data connections",
            "Executive KPIs & visualizations",
            "Auto-refresh & scheduled reports"
        ]),
        active: true,
        sortOrder: 16,
    },
    {
        name: "Remote IT Helpdesk és Ticketing",
        nameEn: "Remote IT Helpdesk & Ticketing",
        slug: "remote-it-helpdesk-ticketing",
        description: "Távoli informatikai támogatás, hibajegykezelés, felhasználói problémák megoldása, új munkatársak beléptetése és napi IT segítség KKV-knak.",
        descriptionEn: "Remote IT support, ticketing, user issue resolution, employee onboarding and everyday IT assistance for small and medium-sized businesses.",
        price: 69000,
        icon: "Headphones",
        href: "/szolgaltatasok/remote-it-helpdesk-ticketing",
        features: JSON.stringify([
            "Távoli felhasználói IT helpdesk",
            "Professzionális hibajegy (ticket) rendszer",
            "Új munkatársak beléptetése (onboarding)",
            "Microsoft 365 / Google Workspace support"
        ]),
        featuresEn: JSON.stringify([
            "Remote user IT helpdesk support",
            "Professional ticketing system",
            "Employee onboarding support",
            "Microsoft 365 & Google Workspace care"
        ]),
        active: true,
        sortOrder: 17,
    },
]

async function main() {
    console.log('Seeding services...')

    for (const service of services) {
        await prisma.service.upsert({
            where: { slug: service.slug },
            update: service,
            create: service,
        })
        console.log(`  ✓ ${service.name}`)
    }

    console.log('Done! Seeded', services.length, 'services.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
