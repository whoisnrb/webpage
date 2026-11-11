export interface AzureServicePlanDef {
    name: string
    desc: string
    price: number
    sub: string
    badge?: string
    popular?: boolean
    features: string[]
    duration_label: string
}

export interface AzureServiceLocaleContent {
    title: string
    description: string
    keywords: string
    megaTitle: string
    megaDesc: string
    hero_features: string[]
    hero_benefits: Array<{ title: string; description: string }>
    use_cases_title: string
    use_cases_desc: string
    use_cases_items: Array<{ title: string; description: string; example: string; roi: string }>
    pricing_title: string
    pricing_desc: string
    plans: {
        base: AzureServicePlanDef
        detailed: AzureServicePlanDef
        complex: AzureServicePlanDef
    }
    how_we_work_title: string
    how_we_work_desc: string
    how_we_work_steps: Array<{ title: string; description: string }>
    faq_title: string
    faq_desc: string
    faq_items: Array<{ question: string; answer: string }>
    cta_title: string
}

export interface AzureServiceDefinition {
    serviceKey: string
    navKey: string
    category: "growth" | "security_cloud" | "core" | "infrastructure"
    slug: string
    enSlug: string
    icon: string
    popular?: boolean
    sortOrder: number
    basePrice: number
    hu: AzureServiceLocaleContent
    en: AzureServiceLocaleContent
}

export const NEW_AZURE_SERVICES: AzureServiceDefinition[] = [
    // 1. Continuous Security Monitoring & NIS2
    {
        serviceKey: "SecurityMonitoringNIS2",
        navKey: "sec_monitoring",
        category: "security_cloud",
        slug: "folyamatos-kibervedelmi-monitoring-nis2",
        enSlug: "continuous-security-monitoring-nis2",
        icon: "Radar",
        popular: true,
        sortOrder: 18,
        basePrice: 29000,
        hu: {
            title: "0–24 Kibervédelmi Monitoring & NIS2",
            description: "Folyamatos automatizált biztonsági felügyelet cégeknek: SSL/DNS/port figyelés, NIS2 megfelelőségi ellenőrzés, azonnali riasztások és havi vezetői PDF audit jelentés.",
            keywords: "nis2 megfelelőség, kiberbiztonsági monitoring, ssl figyelés, dmarc ellenőrzés, havi it biztonsági riport, sebezhetőség figyelő",
            megaTitle: "0–24 Kibervédelmi Monitoring & NIS2",
            megaDesc: "Folyamatos támadásifelület-figyelés és havi vezetői PDF audit",
            hero_features: [
                "Napi SSL, DNS, SPF/DMARC és nyitott port szkennelés",
                "Azonnali riasztás adatbázis- vagy adminport kitettségnél",
                "NIS2 előkészítő kontrollok és dokumentált naplózás",
                "Domain- és IP-hírnév, darknet adatszivárgás ellenőrzés",
                "Automatikusan kiküldött márkázott vezetői PDF riport",
                "Zero érintéses működés az Azure felhőből"
            ],
            hero_benefits: [
                {
                    title: "NIS2 Audit Nyugalom",
                    description: "Rendszeres, dokumentált bizonyítékot kap a vezetőség és a hatósági auditor a külső sérülékenységek ellenőrzéséről."
                },
                {
                    title: "Azonnali Korai Riasztás",
                    description: "Ha lejár egy tanúsítvány, eltűnik a DMARC, vagy véletlenül nyitva marad egy port, perceken belül riasztást kapsz."
                },
                {
                    title: "Vezetői PDF Jelentések",
                    description: "Érthető, cégvezetőknek szánt havi összesítő konkrét teendőkkel — technikai zsargon nélkül."
                }
            ],
            use_cases_title: "Miben segít a folyamatos védelem?",
            use_cases_desc: "A támadók nem évente egyszer keresnek rést — ezért a védelemnek is folyamatosan figyelnie kell",
            use_cases_items: [
                {
                    title: "NIS2 Előkészítés & Dokumentáció",
                    description: "Az EU NIS2 irányelv előírja a rendszerek rendszeres kockázatelemzését és biztonsági felülvizsgálatát.",
                    example: "A cég havonta kézhez kapja a BacklineIT automatizált biztonsági riportját, ami igazolja a kontrollok működését.",
                    roi: "Audit-kész dokumentáció 0 mérnöki túlórával"
                },
                {
                    title: "Véletlen Konfigurációs Hibák Elkapása",
                    description: "Egy frissítés vagy tűzfal-módosítás után nyitva maradt adatbázis- vagy RDP port komoly betörési pont.",
                    example: "A rendszer 24 órán belül észleli a nyitott 3306/3389 portot, és azonnal értesíti az üzemeltetést.",
                    roi: "Zsarolóvírus-támadások megelőzése"
                },
                {
                    title: "Márkahamisítás & Email Biztonság",
                    description: "SPF, DKIM, DMARC és feketelista állapot figyelése, hogy a számlázó leveleid ne a spambe essenek.",
                    example: "Riasztás küldése, ha egy marketing DNS-módosítás elrontotta az érvényes DMARC szabályt.",
                    roi: "Magasabb email kézbesíthetőség és márka-bizalom"
                },
                {
                    title: "Adatszivárgás & Jelszó-kitettség",
                    description: "Céges email címek monitorozása nyilvánosságra került adatbázisokban.",
                    example: "Azonnali jelszócsere-értesítés, ha egy munkatárs regisztrációja külső portálon kiszivárgott.",
                    roi: "Fiókátvételek megakadályozása"
                }
            ],
            pricing_title: "Kibervédelmi Monitoring Csomagok",
            pricing_desc: "Átlátható havidíjas előfizetéses csomagok folyamatos felügyelettel. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Domain Guard Start",
                    desc: "Alap külső támadásifelület-figyelés 1 fő domainhez.",
                    price: 29000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "1 fő domain + maximum 3 aldomain figyelése",
                        "Napi SSL tanúsítvány és DNS/DMARC ellenőrzés",
                        "Veszélyes portok folyamatos monitorozása",
                        "Havi automatikus vezetői PDF biztonsági riport",
                        "Azonnali e-mail riasztás kritikus eltéréskor"
                    ],
                    duration_label: "Ajánlott: kisebb cégeknek, webshopoknak, irodáknak."
                },
                detailed: {
                    name: "NIS2 Shield Business",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Teljes körű külső monitoring és NIS2 megfelelőségi riportálás.",
                    price: 59000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Akár 5 domain és 20 aldomain / szerver IP figyelése",
                        "Fekete-lista és darknet szivárgás monitorozás",
                        "HTTP biztonsági fejléc és CMS sérülékenység ellenőrzés",
                        "Munkavállalói kiszivárgott jelszó-ellenőrzés",
                        "Részletes havi AI + mérnöki PDF jelentés & javítási terv"
                    ],
                    duration_label: "Ajánlott: középvállalatoknak és NIS2 érintett cégeknek."
                },
                complex: {
                    name: "Enterprise SecOps",
                    desc: "Dedikált több-telephelyes védelem SIEM és ticket integrációval.",
                    price: 119000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Korlátlan céges domain, IP tartomány és felhő végpont",
                        "Teams / Slack / Helpdesk azonnali riasztási webhookok",
                        "Microsoft Defender / Sentinel esemény-korreláció",
                        "Negyedéves élő biztonsági konzultáció cégvezetővel",
                        "Prioritásos incidenskezelési SLA (< 2 óra)"
                    ],
                    duration_label: "Ajánlott: pénzügyi, gyártó és több telephelyes cégeknek."
                }
            },
            how_we_work_title: "Hogyan működik a bevezetés?",
            how_we_work_desc: "Akár 24 órán belül élesítjük a folyamatos figyelést az infrastruktúrád megzavarása nélkül.",
            how_we_work_steps: [
                { title: "Célpontok felvétele", description: "Összeírjuk a céges domaineket, szerver IP-ket és levelezési rendszereket." },
                { title: "Alapállapot Audit", description: "Lefuttatunk egy kezdeti mélyszkennelést és felállítjuk a zéró pontot." },
                { title: "Riasztások bekötése", description: "Beállítjuk az e-mail / Teams értesítési csatornákat az illetékeseknek." },
                { title: "0–24 Automatizálás", description: "Az Azure motor napi és heti ciklusokban folyamatosan ellenőrzi a végpontokat." },
                { title: "Havi Riportolás", description: "Minden hónap elején megérkezik az audit-kész vezetői PDF dokumentum." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a folyamatos biztonsági felügyeletről",
            faq_items: [
                {
                    question: "Lassítja vagy leterheli a weboldalunkat a napi vizsgálat?",
                    answer: "Egyáltalán nem. A felügyelet célzott, kíméletes infrastruktúra-ellenőrzéseket végez (TLS handshake, DNS TXT rekordok, HTTP headerek), nem terheli a kiszolgálót."
                },
                {
                    question: "Elfogadható a havi PDF riport NIS2 vagy ügyfél-audit során?",
                    answer: "Igen, a jelentések pontos időbélyeggel, technikai bizonyítékokkal és prioritizált intézkedési naplóval készülnek, így kiváló mellékletei a belső IT biztonsági nyilvántartásnak."
                },
                {
                    question: "Mi történik, ha a monitor hibát vagy nyitott portot talál?",
                    answer: "Azonnal értesítünk téged vagy a rendszergazdádat a pontos javítási lépésekkel, igény esetén pedig a BacklineIT mérnökei el is hárítják a problémát."
                },
                {
                    question: "Kell hozzá szoftvert telepíteni a szerverünkre?",
                    answer: "Az alap és Business csomagokhoz nincs szükség semmilyen ügynökprogram (agent) telepítésére; mindent kívülről, a nyilvános támadási felület felől ellenőrzünk."
                }
            ],
            cta_title: "Indítsd el a 0–24 biztonsági felügyeletet"
        },
        en: {
            title: "24/7 Security Monitoring & NIS2",
            description: "Continuous automated cybersecurity monitoring for businesses: SSL, DNS/DMARC and port scanning, NIS2 readiness checks, real-time alerts and monthly executive PDF audit reports.",
            keywords: "nis2 compliance, cybersecurity monitoring, continuous vulnerability scanning, ssl monitoring, dmarc audit",
            megaTitle: "24/7 Security Monitoring & NIS2",
            megaDesc: "Continuous attack-surface monitoring & monthly executive PDFs",
            hero_features: [
                "Daily SSL, DNS, SPF/DMARC and open port checks",
                "Real-time alerts when databases or admin ports expose",
                "NIS2 compliance controls & audit-ready logging",
                "Blacklist, domain reputation & credential leak checks",
                "Automated monthly executive PDF audit reports",
                "Zero-footprint cloud engine hosted in EU Azure"
            ],
            hero_benefits: [
                {
                    title: "NIS2 Audit Readiness",
                    description: "Provide management and auditors with consistent, dated proof of external risk monitoring."
                },
                {
                    title: "Instant Early Warnings",
                    description: "Detect expired SSL certs, broken DMARC policies, or accidental firewall openings within minutes."
                },
                {
                    title: "Executive PDF Reports",
                    description: "Receive clear monthly boardroom-ready PDF summaries instead of raw technical logs."
                }
            ],
            use_cases_title: "Where Does Continuous Monitoring Help?",
            use_cases_desc: "Attackers probe your perimeter every day — your security monitoring should run every day too",
            use_cases_items: [
                {
                    title: "NIS2 Preparation & Governance",
                    description: "The EU NIS2 directive mandates ongoing vulnerability assessment and risk visibility.",
                    example: "Receive an automated branded PDF report every month verifying all external controls.",
                    roi: "Audit-ready compliance artifacts"
                },
                {
                    title: "Catching Firewall Misconfigurations",
                    description: "Server updates often leave sensitive ports like 3306 or 3389 inadvertently reachable.",
                    example: "Instant alert dispatched before automated ransomware bots discover the exposed port.",
                    roi: "Prevent breaches before exploitation"
                },
                {
                    title: "Email Deliverability & Spoofing Guard",
                    description: "Monitor SPF, DKIM and DMARC records so spoofers cannot impersonate your company.",
                    example: "Immediate notification if a third-party DNS change breaks your DMARC enforcement.",
                    roi: "Higher inbox placement & brand trust"
                },
                {
                    title: "Credential Exposure Detection",
                    description: "Watch corporate email domains against public breach compilations.",
                    example: "Prompt affected staff to reset passwords immediately after third-party breaches.",
                    roi: "Stop credential stuffing attacks"
                }
            ],
            pricing_title: "Security Monitoring Packages",
            pricing_desc: "Transparent monthly plans powered by our EU Azure cloud engine. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Domain Guard Start",
                    desc: "Essential attack-surface monitoring for 1 primary domain.",
                    price: 29000,
                    sub: "HUF / month (VAT-free)",
                    features: [
                        "1 primary domain + up to 3 subdomains",
                        "Daily SSL certificate & DNS/DMARC health checks",
                        "Continuous critical port exposure scanning",
                        "Monthly executive PDF audit report",
                        "Instant email alerts on critical changes"
                    ],
                    duration_label: "Best for small businesses, agencies and webshops."
                },
                detailed: {
                    name: "NIS2 Shield Business",
                    badge: "Most popular",
                    popular: true,
                    desc: "Comprehensive monitoring & NIS2 compliance reporting.",
                    price: 59000,
                    sub: "HUF / month (VAT-free)",
                    features: [
                        "Up to 5 domains & 20 subdomains / IPs monitored",
                        "Domain blacklist & credential leak monitoring",
                        "HTTP security header & CMS surface checks",
                        "Automated executive PDF + AI action plan every month",
                        "Priority remediation support recommendations"
                    ],
                    duration_label: "Best for growing SMBs & NIS2-regulated firms."
                },
                complex: {
                    name: "Enterprise SecOps",
                    desc: "Dedicated multi-site monitoring with SIEM & chat integrations.",
                    price: 119000,
                    sub: "HUF / month (VAT-free)",
                    features: [
                        "Unlimited corporate domains, IPs & cloud endpoints",
                        "Microsoft Teams / Slack / Ticketing alert webhooks",
                        "Microsoft Sentinel & Defender event integration",
                        "Quarterly security review call with leadership",
                        "Priority incident response SLA (< 2 hours)"
                    ],
                    duration_label: "Best for manufacturing, fintech & multi-site groups."
                }
            },
            how_we_work_title: "How We Deploy",
            how_we_work_desc: "Zero downtime onboarding completed within 24 hours.",
            how_we_work_steps: [
                { title: "Asset Inventory", description: "We map your corporate domains, mail servers, and public IPs." },
                { title: "Baseline Audit", description: "We run an initial deep scan to establish your security baseline." },
                { title: "Alert Routing", description: "Configure instant alert channels to IT or management." },
                { title: "24/7 Cloud Watch", description: "Our Azure engine executes continuous automated checks." },
                { title: "Monthly PDF Briefing", description: "Receive executive reports ready for NIS2 compliance files." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Everything you need to know about continuous monitoring",
            faq_items: [
                {
                    question: "Will automated scans slow down our production website?",
                    answer: "No. Checks perform lightweight handshake and DNS inspections without generating high request volume."
                },
                {
                    question: "Does this cover NIS2 compliance requirements?",
                    answer: "It fulfills external perimeter vulnerability monitoring and produces documented monthly evidence."
                },
                {
                    question: "What happens when an exposure is detected?",
                    answer: "You receive an instant alert with exact remediation steps, and our engineers can fix it upon request."
                },
                {
                    question: "Do we need to install agents on our servers?",
                    answer: "No software installation is needed for Start and Business tiers — all checks operate externally."
                }
            ],
            cta_title: "Start 24/7 Security Monitoring"
        }
    },

    // 2. Managed Phishing Simulation & Training
    {
        serviceKey: "PhishingSimulation",
        navKey: "phishing_sim",
        category: "security_cloud",
        slug: "adathalaszat-szimulacio-biztonsagi-oktatas",
        enSlug: "phishing-simulation-security-training",
        icon: "MailCheck",
        sortOrder: 19,
        basePrice: 45000,
        hu: {
            title: "Adathalászat-Szimuláció & Dolgozói Képzés",
            description: "Magyar nyelvű, AI-vezérelt adathalász tesztkampányok és automatizált munkavállalói biztonságtudatossági oktatás cégeknek — a leggyengébb láncszem megerősítésére.",
            keywords: "adathalászat szimuláció, phishing teszt, kiberbiztonsági oktatás dolgozóknak, security awareness képzés, nis2 dolgozói oktatás",
            megaTitle: "Adathalászat-Szimuláció",
            megaDesc: "Élethű magyar tesztlevelek és automatizált biztonsági oktatás",
            hero_features: [
                "Élethű magyar üzleti és futár/bank/IT témájú tesztlevelek",
                "Részletes kattintási és jelszómegadási statisztikák",
                "Azonnali interaktív gyorstalpaló hibázó kollégáknak",
                "Kiemelt vezetői / NIS2 oktatási megfelelőségi jegyzőkönyv",
                "Dolgozói adatvédelemre és pozitív tanulásra optimalizálva",
                "0 manuális szervezés az ügyfél HR / IT oldaláról"
            ],
            hero_benefits: [
                {
                    title: "Valódi Védelem",
                    description: "A kibertámadások 82%-a emberi hibával indul — a szimuláció megtanítja a csapatot felismerni a gyanús leveleket."
                },
                {
                    title: "Magyar Kontextus",
                    description: "Nem angol sablonokat küldünk, hanem magyar nyelvű NAV, banki, M365 és csomagküldő szituációkat."
                },
                {
                    title: "NIS2 Dokumentáció",
                    description: "Minden kampány végén tanúsított részvételi és eredményességi riportot kaptok az auditokhoz."
                }
            ],
            use_cases_title: "Miért nélkülözhetetlen a dolgozói teszt?",
            use_cases_desc: "Hiába drága a tűzfal, ha egy munkatárs véletlenül megadja a céges jelszavát egy hamis belépő oldalon",
            use_cases_items: [
                {
                    title: "M365 & Céges Fiók Védelem",
                    description: "Hamis „lejárt a Microsoft 365 jelszavad” tesztek küldése éles jelszórögzítés nélkül.",
                    example: "Ha valaki kattint, nem valódi adatlopás történik, hanem egy barátságos 2 perces oktatóoldal jelenik meg.",
                    roi: "Akár 75%-kal kevesebb sikeres adathalászat fél év alatt"
                },
                {
                    title: "Vezetői Áll-levelek (CEO Fraud) Szűrése",
                    description: "Pénzügyesek felkészítése a sürgős utalást kérő hamis ügyvezetői emailekre.",
                    example: "Szimulált számlamódosítási kérés, ami megtanítja a telefonos visszaigazolás rutinját.",
                    roi: "Milliós utalási csalások megelőzése"
                },
                {
                    title: "Negyedéves NIS2 / ISO 27001 Képzés",
                    description: "Kötelező biztonságtudatossági oktatás egyszerű, online elvégezhető formában.",
                    example: "Automatikus kvíz kitöltése és letölthető névre szóló igazolás a HR mappába.",
                    roi: "Audit-megfelelőség órák alatt"
                },
                {
                    title: "Új Belépők Gyors Képzése",
                    description: "Minden új kolléga automatikusan kap egy interaktív biztonsági gyorstalpalót.",
                    example: "10 perces vizsga a biztonságos jelszókezelésről és kétfaktoros belépésről.",
                    roi: "Egységes céges biztonsági kultúra"
                }
            ],
            pricing_title: "Phishing Szimuláció Csomagok",
            pricing_desc: "Skálázható csomagok kis csapatoktól nagyvállalatokig. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Awareness Check (Egyszeri)",
                    desc: "Egyszeri felmérő phishing tesztkampány max. 25 főre.",
                    price: 45000,
                    sub: "egyszeri díj (ÁFA-mentes)",
                    features: [
                        "Maximum 25 munkavállalói postafiók tesztelése",
                        "2 különböző élethű magyar adathalász sablon",
                        "Részletes kattintási és sebezhetőségi jelentés",
                        "Ajánlott belső szabályzati javaslatok a vezetésnek"
                    ],
                    duration_label: "Ajánlott: azonnali állapotfelméréshez és biztonsági nyitányhoz."
                },
                detailed: {
                    name: "PhishGuard Pro",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Folyamatos negyedéves szimuláció és automatikus dolgozói képzés.",
                    price: 89000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Akár 100 munkavállaló folyamatos tesztelése",
                        "Havi / negyedéves rotáló AI-testreszabott kampányok",
                        "Interaktív magyar oktatóvideók és azonnali mini-tesztek",
                        "NIS2 kompatibilis képzési jegyzőkönyv és riport",
                        "Pénzügyi / HR részlegekre célzott speciális forgatókönyvek"
                    ],
                    duration_label: "Ajánlott: 20–100 fős cégeknek és NIS2 kötelezetteknek."
                },
                complex: {
                    name: "Enterprise Cyber Culture",
                    desc: "Korlátlan létszám, egyedi arculatos oktatóportál és mély elemzés.",
                    price: 179000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Korlátlan munkavállaló és több leányvállalat kezelése",
                        "Microsoft Entra ID automatikus dolgozó-szinkronizáció",
                        "Vállalatspecifikus (pl. belső ERP/HR másolat) szimulációk",
                        "Részlegenkénti kockázati rangsor és vezetői workshop",
                        "Dedikált biztonsági oktatási tanácsadó"
                    ],
                    duration_label: "Ajánlott: nagyvállalatoknak, banki, logisztikai és IT szektornak."
                }
            },
            how_we_work_title: "Hogyan zajlik egy kampány?",
            how_we_work_desc: "Teljesen diszkréten, zéró adatgyűjtési kockázattal futtatjuk le a szimulációkat.",
            how_we_work_steps: [
                { title: "Forgatókönyv kiválasztása", description: "Egyeztetjük, milyen témájú (IT, futár, számla) levelekkel teszteljünk." },
                { title: "Allowlist beállítása", description: "M365/Google Workspace oldalon gondoskodunk róla, hogy célba érjenek a tesztek." },
                { title: "Fokozatos kiküldés", description: "Nem egyszerre, hanem elszórtan érkeznek a levelek a valósághű hatásért." },
                { title: "Azonnali edukáció", description: "Kattintás esetén rögtön egy segítő magyar oktatóoldal jelenik meg." },
                { title: "Vezetői értékelés", description: "Átadjuk a százalékos riportot és a további javaslatokat." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a munkavállalói tesztelésről",
            faq_items: [
                {
                    question: "Eltárolják a dolgozók beírt valódi jelszavait a teszt során?",
                    answer: "Soha! A tesztoldalak technikai szinten is le vannak tiltva jelszavak mentéséről: kizárólag a beküldés tényét naplózzuk, magát a karaktersort nem tároljuk."
                },
                {
                    question: "Nem sértődnek meg a kollégák a teszt miatt?",
                    answer: "A hangsúlyt nem a megszégyenítésre, hanem a támogató tanulásra helyezzük — érthetően bemutatva a trükköket, amikre figyelniük kell."
                },
                {
                    question: "Működik Microsoft 365 és Google Workspace mellett is?",
                    answer: "Igen, mindkét levelezőrendszerhez percek alatt beállítható biztonságos kézbesítéssel."
                }
            ],
            cta_title: "Erősítsd meg a csapatod védelmét"
        },
        en: {
            title: "Phishing Simulation & Security Training",
            description: "Realistic AI-powered phishing campaigns and automated employee security awareness training tailored for Hungarian and international teams — strengthening the human firewall.",
            keywords: "phishing simulation, security awareness training, employee cybersecurity test, nis2 awareness training",
            megaTitle: "Phishing Simulation & Training",
            megaDesc: "Realistic test campaigns & automated awareness courses",
            hero_features: [
                "Realistic localized business, IT, banking & delivery lures",
                "Zero credential storage — strictly click & submit telemetry",
                "Instant interactive micro-training upon failure",
                "NIS2 & ISO 27001 compliant training records & audit logs",
                "Targeted scenarios for Finance, HR and Executives",
                "Hands-off managed execution by our security team"
            ],
            hero_benefits: [
                {
                    title: "Human Firewall",
                    description: "Over 80% of breaches begin with human interaction — regular simulations sharpen employee vigilance."
                },
                {
                    title: "Zero Password Capture",
                    description: "Test landing pages strictly discard typed passwords and record only safe behavioral metrics."
                },
                {
                    title: "Audit Documentation",
                    description: "Export comprehensive completion certificates and risk reduction metrics for NIS2 audits."
                }
            ],
            use_cases_title: "Why Test Your Team?",
            use_cases_desc: "Firewalls cannot stop a staff member from voluntarily typing credentials into a convincing clone",
            use_cases_items: [
                {
                    title: "Cloud Login Impersonation",
                    description: "Safe Microsoft 365 and Google Workspace login lures without storing sensitive strings.",
                    example: "Clicking opens a friendly 2-minute interactive visual breakdown showing the red flags.",
                    roi: "Up to 75% fewer clicks within 6 months"
                },
                {
                    title: "CEO Fraud & Invoice Defense",
                    description: "Train finance staff to spot urgent wire-transfer or vendor IBAN change spoofs.",
                    example: "Simulated executive request reinforcing out-of-band phone verification habits.",
                    roi: "Prevent costly wire fraud losses"
                },
                {
                    title: "Automated NIS2 Training",
                    description: "Quarterly compliance education tracked automatically per employee.",
                    example: "Quiz completion triggers downloadable compliance certificates.",
                    roi: "Effortless audit governance"
                },
                {
                    title: "New-Hire Onboarding Track",
                    description: "Ensure every new colleague masters password hygiene before handling company data.",
                    example: "Automated week-one module on MFA, phishing red flags, and safe sharing.",
                    roi: "Consistent company-wide security posture"
                }
            ],
            pricing_title: "Phishing Simulation Packages",
            pricing_desc: "Scalable programs for teams of every size. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Awareness Check (One-Off)",
                    desc: "Single baseline phishing test campaign up to 25 staff.",
                    price: 45000,
                    sub: "one-time fee (VAT-free)",
                    features: [
                        "Up to 25 employee mailboxes tested",
                        "2 realistic business phishing scenarios",
                        "Executive click-rate & vulnerability summary report",
                        "Policy recommendations for IT & leadership"
                    ],
                    duration_label: "Best for a baseline risk snapshot."
                },
                detailed: {
                    name: "PhishGuard Pro",
                    badge: "Most popular",
                    popular: true,
                    desc: "Ongoing quarterly simulations & automated micro-training.",
                    price: 89000,
                    sub: "HUF / month (VAT-free)",
                    features: [
                        "Up to 100 employees continuously trained",
                        "Rotating AI-personalized simulation scenarios",
                        "Instant teachable-moment pages & short quizzes",
                        "NIS2 compliant training attendance certificates",
                        "Department-specific risk heatmaps"
                    ],
                    duration_label: "Best for SMBs (20–100 staff) & NIS2 compliance."
                },
                complex: {
                    name: "Enterprise Cyber Culture",
                    desc: "Unlimited seats, custom training portal & Entra ID sync.",
                    price: 179000,
                    sub: "HUF / month (VAT-free)",
                    features: [
                        "Unlimited staff across multiple subsidiaries",
                        "Automatic Microsoft Entra ID user directory sync",
                        "Custom internal app/ERP themed simulation lures",
                        "Executive leadership security briefings",
                        "Dedicated security awareness advisor"
                    ],
                    duration_label: "Best for enterprise groups & regulated industries."
                }
            },
            how_we_work_title: "How Campaigns Work",
            how_we_work_desc: "Launched discreetly without disrupting normal business operations.",
            how_we_work_steps: [
                { title: "Scenario Design", description: "We choose realistic department-appropriate themes." },
                { title: "Mail Allowlisting", description: "Configure M365/Google so simulations bypass spam filters." },
                { title: "Staggered Delivery", description: "Messages trickle out over days for realistic results." },
                { title: "Instant Coaching", description: "Users receive supportive visual coaching immediately on clicks." },
                { title: "Executive Debrief", description: "Full vulnerability metrics and quarterly comparison delivered." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about employee security testing",
            faq_items: [
                {
                    question: "Do you capture actual employee passwords during tests?",
                    answer: "Never. Form inputs are stripped client-side so zero password characters are ever transmitted or logged."
                },
                {
                    question: "Is it compatible with Microsoft 365 and Google Workspace?",
                    answer: "Yes, both platforms are seamlessly supported via safe delivery allowlists."
                },
                {
                    question: "Can we prove training completion to NIS2 auditors?",
                    answer: "Yes, every quarterly cycle generates timestamped participation and pass-rate reports."
                }
            ],
            cta_title: "Strengthen Your Human Firewall"
        }
    },

    // 3. Managed Enterprise WAF & Edge Web Shield
    {
        serviceKey: "ManagedWAF",
        navKey: "managed_waf",
        category: "security_cloud",
        slug: "menedzselt-enterprise-waf-vedelem",
        enSlug: "managed-enterprise-waf-shield",
        icon: "Shield",
        sortOrder: 20,
        basePrice: 39000,
        hu: {
            title: "Menedzselt Enterprise WAF & Webes Pajzs",
            description: "Vállalati tűzfalpajzs (Azure Front Door WAF) sérülékeny webshopok, régi rendszerek és API-k elé — DDoS, bot-támadás, SQL injection és XSS szűrés szervercsere nélkül.",
            keywords: "enterprise waf, azure front door waf, webshop támadásvédelem, ddos védelem cégeknek, owasp védelem",
            megaTitle: "Menedzselt Enterprise WAF Pajzs",
            megaDesc: "Azure Front Door webes tűzfal, DDoS és botvédelem",
            hero_features: [
                "OWASP Top 10 (SQLi, XSS, RFI) aktív támadásszűrés",
                "Ártalmas scraper és brute-force botok automatikus blokkolása",
                "Régi vagy már nem frissíthető rendszerek azonnali bepajzsolása",
                "Globális peremhálózati gyorsítótárazás és SSL terminálás",
                "Ország-alapú (Geo-blocking) és IP korlátozási szabályok",
                "0–24 menedzselt szabályhangolás téves riasztások nélkül"
            ],
            hero_benefits: [
                {
                    title: "Védelem Kódcsere Nélkül",
                    description: "Elavult PHP/WordPress vagy egyedi céges alkalmazások elé telepítve azonnal blokkolja az ismert támadási mintákat."
                },
                {
                    title: "Bot- & Terhelésmentesítés",
                    description: "Kiszűri a szervert lelassító kéretlen adatbányász botokat és bejelentkezési próbálkozásokat."
                },
                {
                    title: "Gyorsabb Oldalbetöltés",
                    description: "Az Azure globális Edge csomópontjai felgyorsítják az oldalt és leveszik a terhet a központi gépről."
                }
            ],
            use_cases_title: "Mikor életmentő a menedzselt WAF?",
            use_cases_desc: "Védőbástya az internet és a céges szervereid között",
            use_cases_items: [
                {
                    title: "Legacy Rendszerek Megmentése",
                    description: "Régi, nehezen frissíthető belső adminportálok és ERP felületek külső elérésének védelme.",
                    example: "A kritikus sebezhetőségeket a WAF hálózati rétegen megfogja még a szoftver-átállás előtt.",
                    roi: "Azonnali kockázatcsökkentés hónapokig tartó átírás nélkül"
                },
                {
                    title: "Webshop Készlet- és Ár-lopás Megállítása",
                    description: "Konkurensek és árellenőrző botok blokkolása, akik feleslegesen pörgetik az adatbázist.",
                    example: "Rate-limiting szabályokkal megfogjuk az agresszív scrape-forgalmat, így a valódi vevőknek villámgyors marad az oldal.",
                    roi: "Alacsonyabb szerverköltség és stabilabb checkout"
                },
                {
                    title: "Bejelentkezési & API Támadások Kivédése",
                    description: "Brute-force jelszófeltörési kísérletek és kártyatesztelő botok megállítása a fizetésnél.",
                    example: "Gyanús országokból vagy adatközpontokból érkező checkout kérések automatikus szűrése.",
                    roi: "Stripe/SimplePay csalások és díjbüntetések elkerülése"
                },
                {
                    title: "Geo-Fencing Belső Felületekre",
                    description: "Adminisztrációs és számlázó felületek korlátozása kizárólag magyar vagy irodai IP-kre.",
                    example: "A `/wp-admin` vagy `/admin` kizárólag a cég VPN-jéről vagy hazai hálózatból nyitható meg.",
                    roi: "99%-os támadási felület csökkenés"
                }
            ],
            pricing_title: "Enterprise WAF Csomagok",
            pricing_desc: "Teljes körűen menedzselt peremhálózati védelem az Azure Front Door / WAF infrastruktúrán.",
            plans: {
                base: {
                    name: "Edge Shield Start",
                    desc: "Alap OWASP WAF + DDoS védelem 1 weboldalhoz.",
                    price: 39000,
                    sub: "Ft / hó (+ 49.000 Ft egyszeri beállítás)",
                    features: [
                        "1 domain / webalkalmazás védelme",
                        "Menedzselt OWASP Top 10 támadásszűrés",
                        "L3/L4/L7 alap DDoS védelem és SSL offload",
                        "Ország-alapú forgalomszűrés (Geo-blocking)",
                        "Havi blokkolási összefoglaló riport"
                    ],
                    duration_label: "Ajánlott: céges weboldalaknak és kisebb webshopoknak."
                },
                detailed: {
                    name: "Pro Bot & Shop Shield",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Aktív bot-ellenes védelem és egyedi WAF szabálykezelés.",
                    price: 79000,
                    sub: "Ft / hó (+ 69.000 Ft beállítás)",
                    features: [
                        "Akár 3 domain / webshop + API védelem",
                        "Fejlett botvédelem és checkout rate-limiting",
                        "Admin útvonalak IP/Geo korlátozása",
                        "Folyamatos finomhangolás false-positive nélkül",
                        "Globális Edge gyorsítás és kézbesítés"
                    ],
                    duration_label: "Ajánlott: nagy forgalmú webshopoknak és B2B portáloknak."
                },
                complex: {
                    name: "Enterprise Zero-Trust Edge",
                    desc: "Teljes vállalati WAF klaszter, privát origin és SLA.",
                    price: 159000,
                    sub: "Ft / hó (egyedi kiépítéssel)",
                    features: [
                        "Több domain és mikroszolgáltatás központi védelme",
                        "Privát hálózati összeköttetés (Private Link)",
                        "Zero-day sebezhetőségek azonnali virtuális patchelése",
                        "Részletes SIEM / log export és riasztások",
                        "99.99% rendelkezésreállási garancia"
                    ],
                    duration_label: "Ajánlott: fintech, ERP és nagyvállalati rendszerekhez."
                }
            },
            how_we_work_title: "Így kapcsoljuk be a pajzsot",
            how_we_work_desc: "A beüzemelés leállás nélkül, DNS-szinten történik.",
            how_we_work_steps: [
                { title: "Forgalom-felmérés", description: "Elemezzük a jelenlegi végpontokat, API-kat és legitim botokat (pl. Googlebot)." },
                { title: "WAF Konfiguráció", description: "Felállítjuk a Front Door / WAF profilt kezdetben naplózó (Detection) módban." },
                { title: "Finomhangolás", description: "Kiszűrjük az esetleges téves riasztásokat, hogy valódi ügyfelek ne akadjanak el." },
                { title: "Élesítés (Prevention)", description: "Átváltjuk aktív blokkolásra, a támadások azonnal elakadnak a hálózat szélén." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Műszaki tudnivalók a webes tűzfalról",
            faq_items: [
                {
                    question: "Le kell állítani a szerverünket a telepítéshez?",
                    answer: "Nem! A forgalom átirányítása tiszta DNS CNAME váltással, észrevétlenül, nulla másodperc leállással történik."
                },
                {
                    question: "Nem fogja letiltani a Googlebotot vagy a Számlázz.hu webhookokat?",
                    answer: "Kifejezetten figyelünk rá: bevezetés előtt tesztüzemben naplózzuk a forgalmat, és fehérlistára tesszük a legitim partnereket."
                },
                {
                    question: "Tényleg gyorsabb is lesz tőle a weboldal?",
                    answer: "Igen, mert a WAF előtti globális peremszerver (Edge) kiszolgálja a statikus képeket, CSS/JS fájlokat és lezárja az SSL-t."
                }
            ],
            cta_title: "Védd meg a webes rendszereidet"
        },
        en: {
            title: "Managed Enterprise WAF & Web Shield",
            description: "Enterprise web application firewall powered by Azure Front Door WAF — stopping DDoS, malicious scrapers, SQL injection, and XSS attacks before they ever reach your servers.",
            keywords: "managed waf, azure front door waf, ddos protection, bot protection ecommerce, owasp security shield",
            megaTitle: "Enterprise WAF Shield",
            megaDesc: "Azure Front Door firewall, DDoS & malicious bot filtering",
            hero_features: [
                "OWASP Top 10 (SQLi, XSS, command injection) mitigation",
                "Aggressive scraper, credential stuffing & brute-force blocking",
                "Virtual patching for legacy apps that cannot be refactored quickly",
                "Global Edge caching and TLS offloading for faster speed",
                "Geo-blocking and strict IP rules for admin endpoints",
                "24/7 managed tuning to prevent false positives"
            ],
            hero_benefits: [
                {
                    title: "Protect Legacy Systems",
                    description: "Shield older PHP/WordPress or proprietary apps at the network edge without modifying source code."
                },
                {
                    title: "Stop Scraping Bots",
                    description: "Keep competitors and automated bots from exhausting your origin database resources."
                },
                {
                    title: "Edge Acceleration",
                    description: "Serve static assets from Azure global POPs close to your customers."
                }
            ],
            use_cases_title: "When Do You Need Managed WAF?",
            use_cases_desc: "Your resilient perimeter line between the public internet and your origin servers",
            use_cases_items: [
                {
                    title: "Legacy App Virtual Patching",
                    description: "Mitigate known CVEs at the edge while planning long-term application upgrades.",
                    example: "Custom WAF rules neutralize exploits targeting legacy admin frameworks.",
                    roi: "Immediate protection without code freezes"
                },
                {
                    title: "Ecommerce Bot & Scraper Shield",
                    description: "Prevent unauthorized catalog scraping and checkout card-testing attacks.",
                    example: "Rate-limiting locks out abusive bot subnets while keeping shoppers flying.",
                    roi: "Lower compute bills & safer checkouts"
                },
                {
                    title: "Admin Endpoint Lockdown",
                    description: "Restrict sensitive dashboards to corporate VPNs or specific countries.",
                    example: "Zero unauthorized logins reaching `/admin` from foreign bots.",
                    roi: "99% reduction in login attack noise"
                },
                {
                    title: "Always-On DDoS Absorption",
                    description: "Keep your webshop online during traffic spikes or malicious volumetric floods.",
                    example: "Microsoft edge infrastructure absorbs floods seamlessly before origin impact.",
                    roi: "Sustained uptime during peak sales"
                }
            ],
            pricing_title: "Enterprise WAF Packages",
            pricing_desc: "Fully managed perimeter defense on Azure Front Door. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Edge Shield Start",
                    desc: "Managed OWASP WAF & DDoS shield for 1 domain.",
                    price: 39000,
                    sub: "HUF / mo (+ 49k setup)",
                    features: [
                        "1 primary domain / web app protected",
                        "Managed OWASP Top 10 rule sets",
                        "Always-on L3/L4/L7 DDoS mitigation & SSL",
                        "Country-level Geo-blocking policies",
                        "Monthly blocked threat report"
                    ],
                    duration_label: "Best for corporate websites & small webshops."
                },
                detailed: {
                    name: "Pro Bot & Shop Shield",
                    badge: "Most popular",
                    popular: true,
                    desc: "Advanced bot protection & custom endpoint rules.",
                    price: 79000,
                    sub: "HUF / mo (+ 69k setup)",
                    features: [
                        "Up to 3 domains / APIs protected",
                        "Bot manager & checkout rate-limiting",
                        "Admin route Geo/IP locking",
                        "Continuous tuning with zero false positives",
                        "Global Edge CDN acceleration"
                    ],
                    duration_label: "Best for high-traffic webshops & SaaS portals."
                },
                complex: {
                    name: "Enterprise Zero-Trust Edge",
                    desc: "Multi-origin Private Link WAF with strict SLA.",
                    price: 159000,
                    sub: "HUF / mo (custom setup)",
                    features: [
                        "Multi-domain & microservice WAF stack",
                        "Azure Private Link origin isolation",
                        "Emergency virtual patching for zero-day flaws",
                        "Real-time SIEM / log streaming export",
                        "99.99% edge availability SLA"
                    ],
                    duration_label: "Best for fintech, healthcare & enterprise platforms."
                }
            },
            how_we_work_title: "Deployment Steps",
            how_we_work_desc: "Zero-downtime activation via safe DNS cutover.",
            how_we_work_steps: [
                { title: "Traffic Profiling", description: "Audit your endpoints, APIs and trusted integrations." },
                { title: "Detection Mode", description: "Launch WAF in log-only mode to baseline legitimate traffic." },
                { title: "Rule Calibration", description: "Whitelist trusted payment/ERP webhooks cleanly." },
                { title: "Prevention Mode", description: "Flip on active edge blocking with full observability." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Technical details on our Managed WAF",
            faq_items: [
                {
                    question: "Is downtime required to put our site behind WAF?",
                    answer: "No. DNS cutover transitions traffic smoothly with zero downtime."
                },
                {
                    question: "Will legitimate Google bots or payment webhooks be blocked?",
                    answer: "No, we verify all critical partners in detection mode first before enabling blocking."
                },
                {
                    question: "Does WAF also improve load speed?",
                    answer: "Yes, Edge TLS termination and static caching noticeably accelerate response times."
                }
            ],
            cta_title: "Shield Your Web Infrastructure"
        }
    },

    // 4. Private Enterprise ChatGPT & RAG Knowledge Base
    {
        serviceKey: "EnterpriseRAG",
        navKey: "enterprise_rag",
        category: "growth",
        slug: "privat-vallalati-ai-tudasbazis-rag",
        enSlug: "private-enterprise-ai-knowledge-base",
        icon: "Bot",
        popular: true,
        sortOrder: 21,
        basePrice: 290000,
        hu: {
            title: "Privát Vállalati AI Tudásbázis (RAG)",
            description: "Zárt, GDPR-kompatibilis céges AI asszisztens (Azure OpenAI + Vector DB): dolgozóid másodpercek alatt kérdezhetnek a belső PDF-ekből, SharePointból, szerződésekből és kézikönyvekből.",
            keywords: "vállalati chatgpt, privát ai tudásbázis, céges rag rendszer, azure openai magyar, belső dokumentum kereső ai",
            megaTitle: "Privát Vállalati AI Tudásbázis",
            megaDesc: "GDPR-biztos céges GPT saját dokumentumokhoz (RAG)",
            hero_features: [
                "100% zárt EU-s Azure OpenAI — NEM tanul az adataidból",
                "SharePoint, Google Drive, OneDrive és PDF fájlok indexelése",
                "Pontos forrásmegjelölés minden AI válasz végén",
                "Szerepkör-alapú jogosultságkezelés (Microsoft Entra ID)",
                "Több ezer oldalnyi szabályzatból azonnali magyar válasz",
                "Saját céges arculatos webes és Teams felület"
            ],
            hero_benefits: [
                {
                    title: "Zéró Adatszivárgás",
                    description: "A nyilvános ChatGPT-vel ellentétben a céges fájlok az EU-n belül, elszigetelt Azure környezetben maradnak."
                },
                {
                    title: "Azonnali Betanítás",
                    description: "Új kollégák és értékesítők többé nem kérdezgetik a szeniorokat — az AI minden folyamatot fejből tud."
                },
                {
                    title: "Ellenőrizhető Források",
                    description: "Minden válasz mellett ott a kattintható PDF/oldalszám hivatkozás, így nulla a hallucinációs kockázat."
                }
            ],
            use_cases_title: "Kik használják a leghatékonyabban?",
            use_cases_desc: "Tedd azonnal kereshetővé a cégben felhalmozott évtizedes tudást",
            use_cases_items: [
                {
                    title: "Ügyvédi & Tanácsadó Irodák",
                    description: "Korábbi szerződések, beadványok és jogszabályi értelmezések villámgyors keresése.",
                    example: "„Keress rá, milyen kötbérfeltételt adtunk tavaly az X Kft. szállítási szerződésében!”",
                    roi: "Napi 1–2 óra kutatási idő megtakarítása ügyvédenként"
                },
                {
                    title: "Gyártó, Mérnöki & Építőipari Cégek",
                    description: "Műszaki leírások, géphasználati utasítások és minőségbiztosítási (ISO) leírások elérése.",
                    example: "A szerviztechnikus mobilon kérdezi le a gép hibakódjának pontos elhárítását magyarul.",
                    roi: "Gyorsabb hibaelhárítás, kevesebb állásidő"
                },
                {
                    title: "Sales & Ügyfélszolgálati Csapatok",
                    description: "Árlisták, termék-specifikációk és gyakori kifogások azonnali lekérése telefonálás közben.",
                    example: "„Melyik csomagunk támogatja a kétirányú SAP szinkront és mennyi a szállítási határidő?”",
                    roi: "Magabiztosabb értékesítők, gyorsabb ajánlatadás"
                },
                {
                    title: "HR & Belső Folyamatok (SOP)",
                    description: "Munkavállalói kézikönyvek, szabadságolási szabályok és onboarding segédletek.",
                    example: "Új belépők önállóan kapnak pontos választ a belső rendszerek használatáról.",
                    roi: "Tehermentesített HR és menedzsment"
                }
            ],
            pricing_title: "Vállalati AI Tudásbázis Csomagok",
            pricing_desc: "Kulcsrakész, EU-s adatközpontban futó privát RAG rendszerek. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Team AI Vault",
                    desc: "Zárt céges AI asszisztens kisebb dokumentumtárral.",
                    price: 290000,
                    sub: "+ 49.000 Ft/hó Azure üzemeltetés (ÁFA-mentes)",
                    features: [
                        "Maximum 1 000 dokumentum (PDF, DOCX, TXT) indexelése",
                        "Zárt EU-s Azure OpenAI + Vector adatbázis",
                        "Forráshivatkozás (fájlnév + részlet) minden válaszhoz",
                        "Bejelentkezéses védett webes felület (max. 15 fő)",
                        "Havi automatikus tudásbázis-újraindexelés"
                    ],
                    duration_label: "Ajánlott: 5–15 fős irodáknak, ügynökségeknek."
                },
                detailed: {
                    name: "Enterprise RAG Pro",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "SharePoint/Drive szinkron és jogosultságkezelés (Entra ID).",
                    price: 590000,
                    sub: "+ 89.000 Ft/hó üzemeltetés (ÁFA-mentes)",
                    features: [
                        "10 000+ dokumentum és élő SharePoint / Google Drive szinkron",
                        "Microsoft Entra ID (SSO) belépés + mappa-jogosultságok",
                        "Munkatársi visszajelző gombok és keresési statisztikák",
                        "Slack / Microsoft Teams bot integráció",
                        "Dedikált havi prompt-hangolás és új források bekötése"
                    ],
                    duration_label: "Ajánlott: 15–100 fős cégeknek és több részleges csapatoknak."
                },
                complex: {
                    name: "Corporate AI Core",
                    desc: "Többrészleges tudásbázis ERP/CRM élő adatlekérdezéssel.",
                    price: 1190000,
                    sub: "+ 149.000 Ft/hó üzemeltetés (ÁFA-mentes)",
                    features: [
                        "Korlátlan dokumentum, táblázatos (Excel/SQL) adatbázisok",
                        "Élő API lekérdezés céges CRM/ERP rendszerekből",
                        "Egyedi biztonsági audit és magánhálózati (VNet) izoláció",
                        "Külön tudásbázisok részlegenként (HR, Jogi, Műszaki)",
                        "Helyszíni csapatoktatás és dedikált mérnöki támogatás"
                    ],
                    duration_label: "Ajánlott: közép- és nagyvállalatoknak szigorú adatbiztonsággal."
                }
            },
            how_we_work_title: "A bevezetés menete",
            how_we_work_desc: "A tiszta adatforrásoktól a kulcsrakész vállalati AI felületig 2–4 hét alatt.",
            how_we_work_steps: [
                { title: "Adatforrás-audit", description: "Felmérjük, hol és milyen formátumban vannak a céges dokumentumok." },
                { title: "Adatisztítás & Jogosultság", description: "Beállítjuk, hogy ki melyik mappához férhet hozzá biztonságosan." },
                { title: "RAG Motor Kiépítése", description: "Felhúzzuk az Azure AI Search vektor-adatbázist és a GPT-4o modellt." },
                { title: "Tesztelés a Csapattal", description: "Kulcsfelhasználókkal validáljuk a válaszok pontosságát." },
                { title: "Élesítés & Oktatás", description: "Átadjuk a rendszert és betanítjuk a kollégákat a legjobb promptokra." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Adatvédelem és működés a privát vállalati AI-nál",
            faq_items: [
                {
                    question: "Biztosan nem tanul az OpenAI a feltöltött bizalmas szerződéseinkből?",
                    answer: "Garantáltan nem. Az Azure OpenAI Enterprise szolgáltatás szerződéses garanciát ad rá, hogy az adatok az EU adatközpontban maradnak és sosem kerülnek modelltanításra."
                },
                {
                    question: "Láthatja egy gyakornok a vezetőségi pénzügyi dokumentumokat?",
                    answer: "Nem. A Pro és Enterprise csomagokban az Entra ID / Google jogosultságokat örökli az AI, így mindenki csak abból kap választ, amire olvasási joga van."
                },
                {
                    question: "Milyen fájlformátumokat tud kezelni?",
                    answer: "PDF, Word (DOCX), Excel, PowerPoint, Markdown, HTML és Google Docs/SharePoint oldalak egyaránt támogatottak."
                }
            ],
            cta_title: "Építs saját privát vállalati AI-t"
        },
        en: {
            title: "Private Enterprise AI Knowledge Base (RAG)",
            description: "Closed, GDPR-compliant corporate ChatGPT powered by Azure OpenAI & Vector Search — query internal PDFs, SharePoint, contracts and manuals securely in EU data centers.",
            keywords: "enterprise rag system, private company chatgpt, azure openai knowledge base, internal ai search gdpr",
            megaTitle: "Private Enterprise AI (RAG)",
            megaDesc: "GDPR-safe internal ChatGPT over company documents",
            hero_features: [
                "100% isolated EU Azure OpenAI — zero public model training",
                "Indexes SharePoint, Google Drive, OneDrive & PDFs",
                "Verifiable page & document citations in every answer",
                "Role-based access control via Microsoft Entra ID",
                "Instant answers in Hungarian & English across thousands of pages",
                "Branded corporate web portal & Microsoft Teams bot"
            ],
            hero_benefits: [
                {
                    title: "Zero Data Leakage",
                    description: "Unlike public AI tools, proprietary contracts stay strictly within isolated EU Azure storage."
                },
                {
                    title: "Faster Onboarding",
                    description: "New employees get instant accurate procedures without interrupting senior specialists."
                },
                {
                    title: "Zero Hallucination Guesswork",
                    description: "Every response cites clickable source files and exact passages for verification."
                }
            ],
            use_cases_title: "High-Impact Use Cases",
            use_cases_desc: "Turn years of trapped organizational documents into instant answers",
            use_cases_items: [
                {
                    title: "Law & Advisory Firms",
                    description: "Search precedents, historic contracts and legal templates instantaneously.",
                    example: "“Find penalty clauses negotiated in our logistics agreements from last year.”",
                    roi: "Save 1–2 hours per consultant daily"
                },
                {
                    title: "Manufacturing & Engineering",
                    description: "Query technical manuals, ISO specs and field troubleshooting SOPs from anywhere.",
                    example: "Field technicians query error-code procedures right from their mobile device.",
                    roi: "Faster repairs & lower downtime"
                },
                {
                    title: "Sales & Support Teams",
                    description: "Look up product specifications, SLA limits and pricing tiers mid-call.",
                    example: "“Which package supports bidirectional ERP sync and what is lead time?”",
                    roi: "Faster quotes & higher win rates"
                },
                {
                    title: "HR & Onboarding SOPs",
                    description: "Empower staff to look up PTO, tooling, and internal policy answers 24/7.",
                    example: "Self-service onboarding guide without flooding HR mailboxes.",
                    roi: "Streamlined people operations"
                }
            ],
            pricing_title: "Enterprise AI RAG Packages",
            pricing_desc: "Turnkey private AI deployments in EU Azure regions. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Team AI Vault",
                    desc: "Private corporate AI assistant for core documents.",
                    price: 290000,
                    sub: "+ 49k HUF/mo hosting (VAT-free)",
                    features: [
                        "Up to 1,000 PDF/DOCX/TXT documents indexed",
                        "Isolated EU Azure OpenAI + Vector search DB",
                        "Source document & excerpt citations on answers",
                        "Protected corporate web app (up to 15 users)",
                        "Monthly automated re-indexing cycle"
                    ],
                    duration_label: "Best for agencies, legal teams & small offices."
                },
                detailed: {
                    name: "Enterprise RAG Pro",
                    badge: "Most popular",
                    popular: true,
                    desc: "Live SharePoint/Drive sync with Entra ID permissions.",
                    price: 590000,
                    sub: "+ 89k HUF/mo hosting (VAT-free)",
                    features: [
                        "10,000+ docs & continuous cloud drive syncing",
                        "Microsoft Entra ID SSO & document-level permissions",
                        "Teams / Slack integration & feedback analytics",
                        "Custom corporate branding & prompt tuning",
                        "Monthly optimization & connector updates"
                    ],
                    duration_label: "Best for SMBs (15–100 staff) & multi-team firms."
                },
                complex: {
                    name: "Corporate AI Core",
                    desc: "Multi-department RAG plus live ERP/CRM data connectors.",
                    price: 1190000,
                    sub: "+ 149k HUF/mo hosting (VAT-free)",
                    features: [
                        "Unlimited docs + structured SQL/Excel retrieval",
                        "Live read integrations with CRM/ERP systems",
                        "VNet private networking & custom security audit",
                        "Separate scoped workspaces (HR, Legal, Tech)",
                        "Hands-on staff training & dedicated AI engineer"
                    ],
                    duration_label: "Best for enterprise organizations with strict governance."
                }
            },
            how_we_work_title: "Delivery Process",
            how_we_work_desc: "From raw file folders to production private AI within 2–4 weeks.",
            how_we_work_steps: [
                { title: "Data Discovery", description: "Audit your repositories, formats, and folder structure." },
                { title: "Security Mapping", description: "Design Entra ID permissions so sensitive files remain private." },
                { title: "RAG Pipeline Build", description: "Deploy Azure AI Search vector embeddings and GPT-4o." },
                { title: "Accuracy Validation", description: "Test real team queries and fine-tune retrieval chunking." },
                { title: "Launch & Training", description: "Roll out across web/Teams with user prompt workshops." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Data privacy and technical design",
            faq_items: [
                {
                    question: "Does OpenAI train models on our private documents?",
                    answer: "No. Azure OpenAI Enterprise contractually guarantees zero model training and strict EU data residency."
                },
                {
                    question: "Can junior staff see executive financial documents?",
                    answer: "No. Permission trimming respects your Entra ID / folder ACLs on every query."
                },
                {
                    question: "Which file types are supported?",
                    answer: "PDF, DOCX, XLSX, PPTX, TXT, Markdown, SharePoint and Google Docs are all supported."
                }
            ],
            cta_title: "Launch Your Private Company AI"
        }
    },

    // 5. AI Document, Invoice & Contract Processing (OCR)
    {
        serviceKey: "DocumentOCR",
        navKey: "doc_ocr",
        category: "growth",
        slug: "ai-dokumentum-es-szamlafeldolgozo-ocr",
        enSlug: "ai-document-invoice-processing",
        icon: "FileText",
        sortOrder: 22,
        basePrice: 190000,
        hu: {
            title: "AI Számla-, Szerződés- & Dokumentum-feldolgozó",
            description: "Automatizált dokumentum-felismerés (Azure AI Document Intelligence + GPT-4o): bejövő számlák, szállítólevelek és szerződések kiolvasása és beküldése közvetlenül az ERP/könyvelő rendszerbe.",
            keywords: "ai számlafeldolgozás, dokumentum ocr automatizáció, szállítólevél beolvasás, szerződés elemzés ai, könyvelés automatizálás",
            megaTitle: "AI Számla & Dokumentum OCR",
            megaDesc: "Bejövő számlák, szállítólevelek és szerződések feldolgozása",
            hero_features: [
                "Magyar nyelvű számlák és táblázatos tételek pontos kiolvasása",
                "Szállítólevelek, menetlevelek és munkalapok digitalizálása",
                "Közvetlen export Számlázz.hu, Billingo, SAP, Odoo vagy Excel felé",
                "Automatikus számszaki, ÁFA és adószám validáció",
                "Szerződések kockázati és határidő-kivonatolása GPT-4o-val",
                "Email mellékletek és szkennelt mappák automatikus figyelése"
            ],
            hero_benefits: [
                {
                    title: "90%-kal Kevesebb Adatrögzítés",
                    description: "A kollégáknak többé nem kell PDF-ekből számsorokat másolgatniuk — a rendszer másodpercek alatt rögzíti."
                },
                {
                    title: "Nulla Elgépelés",
                    description: "A rendszer automatikusan ellenőrzi a nettó+ÁFA=bruttó egyenletet és kiszűri a hibás dokumentumokat."
                },
                {
                    title: "Azonnali Kereshetőség",
                    description: "Minden beérkezett papír és PDF strukturált, visszakereshető adatbázisba kerül."
                }
            ],
            use_cases_title: "Mit tudunk automatizálni?",
            use_cases_desc: "Minden papír- és PDF-alapú adminisztráció kiváltható AI adatkinyeréssel",
            use_cases_items: [
                {
                    title: "Bejövő Számlák & Könyvelési Előkészítés",
                    description: "E-mailben érkező PDF számlák tételszintű kiolvasása és költséghely-kategorizálása.",
                    example: "A rendszer felismeri a szállítót, dátumot, ÁFA-kulcsokat és betölti a jóváhagyó táblába.",
                    roi: "Havi több tucat munkaóra megtakarítása a pénzügyön"
                },
                {
                    title: "Logisztikai Szállítólevelek & CMR",
                    description: "Raklapmennyiségek, cikkszámok és aláírások ellenőrzése szkennelt vagy mobillal fotózott lapokról.",
                    example: "A raktáros lefotózza a papírt, a rendszer azonnal összeveti a rendeléssel.",
                    roi: "Gyorsabb áruátvétel, azonnali eltérésjelzés"
                },
                {
                    title: "Szerződés-ellenőrzés & Határidők",
                    description: "Hosszú partneri szerződések kulcsadatainak (felmondási idő, kötbér, árindexálás) kinyerése.",
                    example: "Feltöltött 40 oldalas szerződésből 10 másodperc alatt készít 1 oldalas vezetői összefoglalót.",
                    roi: "Elfelejtett megújítások és rejtett kötbérek elkerülése"
                },
                {
                    title: "HR Önéletrajz & Belépési Nyomtatványok",
                    description: "Jelentkezők CV-inek egységes adatbázisba rendezése és előszűrése.",
                    example: "Automatizált kompetencia-táblázat készítése 200 beérkezett önéletrajzból.",
                    roi: "5x gyorsabb toborzási előszűrés"
                }
            ],
            pricing_title: "AI Dokumentum-feldolgozó Csomagok",
            pricing_desc: "Skálázható megoldások havi dokumentumszámhoz igazítva. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "OCR Start",
                    desc: "Automatikus számla- vagy űrlapfeldolgozó 1 munkafolyamathoz.",
                    price: 190000,
                    sub: "+ 39.000 Ft/hó (max. 1 000 oldal/hó)",
                    features: [
                        "E-mail fiók vagy Google Drive / OneDrive figyelés",
                        "PDF és fotózott számlák kulcsadatainak kiolvasása",
                        "Matematikai & ÁFA ellenőrzési szabályok",
                        "Export Excel / Google Sheets vagy Webhook felé",
                        "Azure AI Document Intelligence + GPT-4o motor"
                    ],
                    duration_label: "Ajánlott: könyvelőirodáknak és kisebb kereskedőknek."
                },
                detailed: {
                    name: "DocFlow Business",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Teljes tételsoros számla-, szállítólevél- és ERP integráció.",
                    price: 440000,
                    sub: "+ 79.000 Ft/hó (max. 5 000 oldal/hó)",
                    features: [
                        "Összetett táblázatok és tételsorok felismerése",
                        "Kétirányú API integráció (CRM, ERP, Számlázz.hu, MiniCRM)",
                        "Jóváhagyási felület bizonytalan tételek ellenőrzésére",
                        "Automatikus költséghely & főkönyvi szám javaslat AI-val",
                        "Havi karbantartás és új sablonok betanítása"
                    ],
                    duration_label: "Ajánlott: logisztikai, gyártó és építőipari KKV-knak."
                },
                complex: {
                    name: "Enterprise IDP Core",
                    desc: "Egyedi szerződéselemző, kézírás-olvasó és SAP/Navision pipeline.",
                    price: 890000,
                    sub: "+ 149.000 Ft/hó (nagy volumen)",
                    features: [
                        "Több dokumentumtípus (szerződés, CMR, számla, jegyzőkönyv)",
                        "Jogi/pénzügyi kockázatelemző GPT-4o réteg",
                        "Közvetlen SAP / Navision / Microsoft BC API összekötés",
                        "Audit naplózás és 5 évig visszakereshető archívum",
                        "Dedikált fejlesztői SLA és teljesítménygarancia"
                    ],
                    duration_label: "Ajánlott: nagyvállalatoknak és magas dokumentumszámhoz."
                }
            },
            how_we_work_title: "Hogyan vezetjük be?",
            how_we_work_desc: "Valódi céges mintadokumentumokon kalibrálva adjuk át a rendszert.",
            how_we_work_steps: [
                { title: "Minták bekérése", description: "Megvizsgálunk 15–20 valódi számlát, szállítólevelet vagy szerződést." },
                { title: "Adatséma tervezése", description: "Rögzítjük, pontosan milyen mezők és milyen formátumban kellenek az ERP-nek." },
                { title: "Azure Pipeline építése", description: "Összekötjük az OCR motort és a GPT-4o validátort a célrendszerrel." },
                { title: "Pontossági teszt", description: "99%+ pontosság eléréséig finomhangoljuk a kivételeket és értesítéseket." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók az AI dokumentumfeldolgozásról",
            faq_items: [
                {
                    question: "Megbirkózik a gyenge minőségű, mobillal fotózott vagy ferde számlákkal is?",
                    answer: "Igen! Az Azure AI Document Intelligence kifejezetten alkalmas ferde, árnyékos fotók, bélyegzők és összetett táblázatok pontos kiolvasására is."
                },
                {
                    question: "Működik magyar ékezetes szavakkal és magyar ÁFA szabályokkal?",
                    answer: "Tökéletesen. A GPT-4o validációs réteg ismeri a magyar adószám-formátumot és ellenőrző algoritmusokat is futtat."
                },
                {
                    question: "Mi történik, ha egy dokumentum olvashatatlan?",
                    answer: "Ha egy sor bizonytalansága meghaladja a küszöböt, a rendszer automatikusan megjelöli emberi jóváhagyásra, így sosem kerül hibás adat a könyvelésbe."
                }
            ],
            cta_title: "Automatizáld a dokumentumaidat"
        },
        en: {
            title: "AI Document, Invoice & Contract OCR",
            description: "Automated document extraction powered by Azure AI Document Intelligence & GPT-4o: parse incoming invoices, delivery notes and contracts directly into your ERP or accounting stack.",
            keywords: "ai invoice processing, document ocr automation, intelligent document processing azure, automated data entry",
            megaTitle: "AI Document & Invoice OCR",
            megaDesc: "Extract invoices, delivery notes & contracts straight to ERP",
            hero_features: [
                "Line-item precision on PDF and photographed invoices",
                "Delivery notes, waybills & field worksheet digitization",
                "Direct push into ERP, accounting, CRM, or spreadsheets",
                "Automated VAT & totals cross-validation checks",
                "Contract risk, deadline & obligation summaries via GPT-4o",
                "Auto-watches shared email inboxes and cloud folders"
            ],
            hero_benefits: [
                {
                    title: "90% Less Data Entry",
                    description: "Eliminate manual copy-pasting from incoming PDFs into accounting or operations software."
                },
                {
                    title: "Zero Typing Errors",
                    description: "Automated checksum logic verifies line totals, VAT math and tax IDs before export."
                },
                {
                    title: "Structured Searchability",
                    description: "Every paper scan turns into clean, queryable structured business records."
                }
            ],
            use_cases_title: "What Can We Automate?",
            use_cases_desc: "Replace repetitive document handling with intelligent cloud pipelines",
            use_cases_items: [
                {
                    title: "Accounts Payable Automation",
                    description: "Parse incoming PDF invoices down to line items and cost-center codes.",
                    example: "Extract vendor, due date, VAT tiers and push cleanly into approval workflows.",
                    roi: "Save dozens of finance hours monthly"
                },
                {
                    title: "Logistics Delivery Notes & PODs",
                    description: "Check quantities, SKUs and signatures from scanned or mobile-snapped paper slips.",
                    example: "Warehouse staff snap a delivery note and mismatches flag instantly against POs.",
                    roi: "Faster receiving & instant discrepancy detection"
                },
                {
                    title: "Contract Clause & Renewal Extraction",
                    description: "Extract notice periods, SLA penalties and indexation clauses from 40-page PDFs.",
                    example: "Upload vendor agreements and get a structured 1-page risk sheet in seconds.",
                    roi: "Avoid missed renewals & hidden penalties"
                },
                {
                    title: "HR Resume & Onboarding Screening",
                    description: "Normalize candidate CVs and onboarding paperwork into structured profiles.",
                    example: "Rank and compare 200 applicant PDFs in an exported skills matrix.",
                    roi: "5x faster recruitment screening"
                }
            ],
            pricing_title: "AI OCR Packages",
            pricing_desc: "Scalable tiers tailored to monthly document volume. Prices exclude VAT.",
            plans: {
                base: {
                    name: "OCR Start",
                    desc: "Automated invoice or form extractor for 1 workflow.",
                    price: 190000,
                    sub: "+ 39k HUF/mo (up to 1,000 pages/mo)",
                    features: [
                        "Shared inbox or Drive/OneDrive folder watcher",
                        "Key header & total extraction on PDFs/photos",
                        "Automated math & VAT validation checks",
                        "Clean export to Excel, Sheets or Webhook",
                        "Azure Document Intelligence + GPT-4o engine"
                    ],
                    duration_label: "Best for accounting firms & small distributors."
                },
                detailed: {
                    name: "DocFlow Business",
                    badge: "Most popular",
                    popular: true,
                    desc: "Full line-item extraction with bidirectional ERP integration.",
                    price: 440000,
                    sub: "+ 79k HUF/mo (up to 5,000 pages/mo)",
                    features: [
                        "Complex multi-page table & line-item recognition",
                        "Bidirectional API push to ERP / CRM / Billing apps",
                        "Human-in-the-loop review queue for low confidence",
                        "AI cost-center & GL account code suggestions",
                        "Monthly maintenance & new vendor tuning"
                    ],
                    duration_label: "Best for logistics, manufacturing & growing SMBs."
                },
                complex: {
                    name: "Enterprise IDP Core",
                    desc: "Custom contract analyzer, handwriting & enterprise ERP sync.",
                    price: 890000,
                    sub: "+ 149k HUF/mo (high volume)",
                    features: [
                        "Multi-document pipeline (contracts, CMR, invoices)",
                        "GPT-4o legal & financial risk extraction",
                        "Direct SAP / Microsoft Business Central / Odoo API",
                        "Full audit trail & 5-year encrypted archive",
                        "Dedicated engineering SLA"
                    ],
                    duration_label: "Best for enterprises handling high document throughput."
                }
            },
            how_we_work_title: "Implementation Steps",
            how_we_work_desc: "Trained and calibrated on your actual business documents.",
            how_we_work_steps: [
                { title: "Sample Review", description: "We analyze 15–20 real invoices or contracts from your operations." },
                { title: "Schema Mapping", description: "Define exact target fields required by your ERP or finance software." },
                { title: "Cloud Pipeline", description: "Connect Azure OCR, GPT-4o validation rules, and destination APIs." },
                { title: "Accuracy QA", description: "Tune confidence thresholds until 99%+ validation reliability is met." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about AI document intelligence",
            faq_items: [
                {
                    question: "Does it handle skewed mobile photos or stamped scans?",
                    answer: "Yes, Azure Document Intelligence excels at noisy scans, rotations and complex tables."
                },
                {
                    question: "How do you prevent incorrect numbers from entering our accounting?",
                    answer: "Built-in checksum validation verifies totals; any low-confidence item flags for quick human review."
                },
                {
                    question: "Can it integrate with our existing ERP?",
                    answer: "Yes, we push clean JSON/XML via REST API, webhooks, SFTP, or direct database connectors."
                }
            ],
            cta_title: "Automate Your Document Flow"
        }
    },

    // 6. AI Voice, Call & Meeting Analyzer
    {
        serviceKey: "MeetingVoiceAI",
        navKey: "voice_ai",
        category: "growth",
        slug: "ai-hivas-es-targyalaselemzo-asszisztens",
        enSlug: "ai-call-meeting-intelligence",
        icon: "Mic",
        sortOrder: 23,
        basePrice: 240000,
        hu: {
            title: "AI Hívás- & Tárgyalás-elemző Asszisztens",
            description: "Magyar nyelvű hangfelismerés és AI értékesítési/ügyfélszolgálati elemzés (Azure Speech + GPT-4o): automatikus jegyzőkönyvek, teendőlisták, ügyfélhangulat-mérés és CRM szinkron.",
            keywords: "ai híváselemző, magyar beszédfelismerés ai, meeting jegyzőkönyv generátor, értékesítési hívás elemzés, call center ai",
            megaTitle: "AI Hívás- & Meeting Elemző",
            megaDesc: "Magyar hangátirat, tárgyalási jegyzőkönyv és CRM szinkron",
            hero_features: [
                "Kiváló pontosságú magyar nyelvű beszéd-szöveg (Azure Whisper/Speech)",
                "Beszélő-elkülönítés (ügyfél vs. értékesítő/support)",
                "Automatikus strukturált jegyzőkönyv és teendőlista (Action Items)",
                "Ügyfélhangulat (Sentiment) és leggyakoribb kifogások felismerése",
                "Közvetlen mentés CRM-be (HubSpot, Pipedrive, MiniCRM, saját admin)",
                "Zárt EU-s Azure hangfeldolgozás adatvédelmi garanciával"
            ],
            hero_benefits: [
                {
                    title: "Soha Többé Elfelejtett Ígéret",
                    description: "Minden telefonhívás és online megbeszélés után pontos lista készül arról, ki mit vállalt határidőre."
                },
                {
                    title: "Sales Hatékonyság Növelése",
                    description: "A vezetők látják, melyik érv működik jól a telefonban és hol akad el a legtöbb érdeklődő."
                },
                {
                    title: "Nulla Jegyzőkönyvezési Idő",
                    description: "Az értékesítő 100%-ban az ügyfélre figyelhet — a jegyzetet és a CRM összefoglalót az AI megírja."
                }
            ],
            use_cases_title: "Hogyan termel bevételt a hang-elemzés?",
            use_cases_desc: "A telefonban és tárgyalásokon elhangzó információ a cég legértékesebb, mégis leggyakrabban elvesző adata",
            use_cases_items: [
                {
                    title: "Sales Tárgyalások & Discovery Hívások",
                    description: "Online meetek és rögzített üzleti hívások automatikus feldolgozása az ajánlatadás előtt.",
                    example: "A meeting után 1 perccel kész a vázlat az ügyfél igényeiről, költségvetéséről és a következő lépésről.",
                    roi: "2x gyorsabb ajánlatkiküldés és magasabb zárási arány"
                },
                {
                    title: "Ügyfélszolgálati Minőségbiztosítás",
                    description: "Beérkező telefonos reklamációk és hibajegyek automatikus kategorizálása.",
                    example: "A rendszer jelzi a vezetőnek azokat a hívásokat, ahol elégedetlen vagy dühös hangulatot észlelt.",
                    roi: "Ügyfél-elvándorlás azonnali csökkentése"
                },
                {
                    title: "Belső Projekt-megbeszélések Jegyzőkönyve",
                    description: "Heti státuszokból pontos feladatlista generálása felelősökkel és dátumokkal.",
                    example: "A Teams felvételből egy kattintással létrejönnek a Jira/Trello kártyák.",
                    roi: "Évi több száz mérnöki és vezetői munkaóra megspórolása"
                },
                {
                    title: "Következő Lépés Email Vázlat",
                    description: "Azonnali, személyre szabott köszönő és összefoglaló e-mail vázlat az ügyfélnek.",
                    example: "„Kedves Péter, ahogy az iménti beszélgetésen egyeztettük, küldöm a 3 pontot...”",
                    roi: "Professzionális ügyfélélmény minden hívás után"
                }
            ],
            pricing_title: "AI Hang- & Meeting Elemző Csomagok",
            pricing_desc: "Rugalmas havi csomagok feldolgozott hangóra szerint. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Meeting Assistant",
                    desc: "Automatikus magyar átirat és jegyzőkönyv kisebb csapatnak.",
                    price: 240000,
                    sub: "+ 45.000 Ft/hó (havi 20 óra hanganyag)",
                    features: [
                        "MP3 / WAV / MP4 / WebM feltöltés és mappaszinkron",
                        "Magyar + angol beszédfelismerés beszélő-szétválasztással",
                        "Strukturált PDF/Markdown jegyzőkönyv + teendők",
                        "Automatikus ügyfél-visszaigazoló email vázlat",
                        "Zárt EU-s Azure hangfeldolgozás"
                    ],
                    duration_label: "Ajánlott: vezetőknek, tanácsadóknak, kisebb sales csapatoknak."
                },
                detailed: {
                    name: "Sales Call Intelligence",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "CRM integráció, kifogás-elemzés és VoIP/Meet összekötés.",
                    price: 490000,
                    sub: "+ 89.000 Ft/hó (havi 80 óra hanganyag)",
                    features: [
                        "VoIP központ / Google Meet / Teams automatikus feldolgozás",
                        "Kétirányú szinkron CRM-be (jegyzetek és teendők)",
                        "Ügyfélhangulat (Sentiment) és értékesítési KPI pontozás",
                        "Kifogás-könyvtár és értékesítési coaching riportok",
                        "Egyedi adminisztrátori keresőfelület a hívásokban"
                    ],
                    duration_label: "Ajánlott: aktív B2B értékesítő csapatoknak és ügynökségeknek."
                },
                complex: {
                    name: "Contact Center Enterprise",
                    desc: "Teljes ügyfélszolgálati QA automatizálás korlátlan agentre.",
                    price: 980000,
                    sub: "+ 169.000 Ft/hó (egyedi volumen)",
                    features: [
                        "Nagy volumenű ügyfélszolgálati hanganyagok 100%-os auditja",
                        "Automatikus eszkalációs riasztás kritikus hangvételkor",
                        "Személyes adatok (PII) automatikus maszkolása a szövegben",
                        "Power BI / egyedi BI vezetői trend-dashboardok",
                        "Dedikált mérnöki támogatás és finomhangolás"
                    ],
                    duration_label: "Ajánlott: call centereknek és nagy ügyfélszolgálatoknak."
                }
            },
            how_we_work_title: "Hogyan építjük be?",
            how_we_work_desc: "A meglévő telefonközpontodhoz vagy meeting rendszeredhez illesztve.",
            how_we_work_steps: [
                { title: "Hangforrás bekötése", description: "Felmérjük, honnan érkeznek a felvételek (VoIP, Teams, Google Meet)." },
                { title: "Magyar Szakszótár", description: "Betanítjuk a saját céges termékneveitekre és rövidítéseitekre a felismerést." },
                { title: "Prompt & CRM Sablon", description: "Kialakítjuk pontosan milyen jegyzőkönyv és milyen CRM mezők töltsenek fel." },
                { title: "Élesítés & Coaching", description: "Átadjuk a felületet és finomítjuk a vezetői riasztási szabályokat." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Minden a magyar nyelvű AI hangfeldolgozásról",
            faq_items: [
                {
                    question: "Mennyire érti a magyar nyelvet és a szakmai kifejezéseket?",
                    answer: "Az Azure AI Speech + GPT-4o utókorrekció még zajszűrt telefonos felvételeken és magyar szakszavakkal is kiemelkedő pontossággal dolgozik."
                },
                {
                    question: "Hogyan van megoldva a GDPR és a hangfelvételek törlése?",
                    answer: "Beállítható, hogy az átirat és az összefoglaló elkészülte után magát a nyers hangfájlt a rendszer automatikusan és véglegesen törölje."
                },
                {
                    question: "Össze tudjátok kötni a saját VoIP központunkkal?",
                    answer: "Igen, szinte minden felhős VoIP (pl. Voovox, Microcall, 3CX, Asterisk) támogat webhookos vagy SFTP felvétel-továbbítást."
                }
            ],
            cta_title: "Alakítsd értékké a hívásaidat"
        },
        en: {
            title: "AI Call & Meeting Intelligence",
            description: "High-accuracy multilingual speech transcription and AI sales/support analytics powered by Azure Speech & GPT-4o: automated minutes, action items, sentiment tracking and CRM sync.",
            keywords: "ai meeting assistant, call analytics ai, azure speech transcription, sales call intelligence, crm call logging",
            megaTitle: "AI Call & Meeting Analyzer",
            megaDesc: "Speech transcription, action items & CRM synchronization",
            hero_features: [
                "High-accuracy Hungarian & English transcription with speaker diarization",
                "Structured executive summaries and dated action-item checklists",
                "Customer sentiment scoring & recurring objection detection",
                "Automatic push of notes and follow-ups into HubSpot / CRM",
                "Follow-up email draft generated seconds after each call",
                "Isolated EU Azure processing with configurable audio auto-purge"
            ],
            hero_benefits: [
                {
                    title: "Zero Dropped Follow-Ups",
                    description: "Every commitment made verbally on a call gets captured cleanly with owners and deadlines."
                },
                {
                    title: "Sharper Sales Coaching",
                    description: "Managers uncover winning talk tracks and recurring buyer objections across the team."
                },
                {
                    title: "100% Focus on Customers",
                    description: "Reps stay engaged in the conversation while AI handles detailed note-taking and CRM entry."
                }
            ],
            use_cases_title: "Where Voice AI Pays Off",
            use_cases_desc: "Turn lost spoken conversations into searchable revenue intelligence",
            use_cases_items: [
                {
                    title: "Discovery & Sales Calls",
                    description: "Summarize buyer pain points, budgets and next steps automatically after calls.",
                    example: "Minutes after a call ends, key requirements and a proposal draft wait in CRM.",
                    roi: "2x faster proposal turnaround"
                },
                {
                    title: "Support Quality Assurance",
                    description: "Monitor 100% of support calls for compliance and early dissatisfaction signals.",
                    example: "Real-time escalation flags trigger whenever negative customer sentiment spikes.",
                    roi: "Prevent silent customer churn"
                },
                {
                    title: "Internal Project Syncs",
                    description: "Extract clear Jira/Trello action tickets from weekly engineering meetings.",
                    example: "Eliminate manual note-taker rotations across product teams.",
                    roi: "Save hundreds of team hours yearly"
                },
                {
                    title: "Instant Recap Emails",
                    description: "Draft polished client summary emails grounded verbatim in the call.",
                    example: "Ready-to-send summary listing every agreed milestone.",
                    roi: "Elevated client professionalism"
                }
            ],
            pricing_title: "AI Voice & Meeting Packages",
            pricing_desc: "Flexible monthly plans scaled to processed audio hours. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Meeting Assistant",
                    desc: "Automated transcription & structured meeting minutes.",
                    price: 240000,
                    sub: "+ 45k HUF/mo (20 audio hours/mo)",
                    features: [
                        "Upload MP3/WAV/MP4 or sync shared meeting folders",
                        "Hungarian + English speaker diarized transcripts",
                        "Structured summary, decisions & action item export",
                        "Auto-generated client recap email drafts",
                        "Secure EU Azure audio processing"
                    ],
                    duration_label: "Best for founders, consultants & small sales pods."
                },
                detailed: {
                    name: "Sales Call Intelligence",
                    badge: "Most popular",
                    popular: true,
                    desc: "CRM integration, VoIP/Meet sync & sales KPI scoring.",
                    price: 490000,
                    sub: "+ 89k HUF/mo (80 audio hours/mo)",
                    features: [
                        "Automated VoIP / Google Meet / Teams ingestion",
                        "Bidirectional CRM note & task logging",
                        "Sentiment analysis & objection trend detection",
                        "Searchable internal call library & keyword alerts",
                        "Custom scoring rubrics for sales leaders"
                    ],
                    duration_label: "Best for B2B sales teams & service agencies."
                },
                complex: {
                    name: "Contact Center Enterprise",
                    desc: "100% support QA automation & PII redaction.",
                    price: 980000,
                    sub: "+ 169k HUF/mo (custom volume)",
                    features: [
                        "High-volume support queue auditing across all agents",
                        "Instant supervisor escalation on risk phrases",
                        "Automated PII scrubbing inside stored transcripts",
                        "Power BI / executive QA trend dashboards",
                        "Dedicated solutions engineer"
                    ],
                    duration_label: "Best for call centers & multi-tier support orgs."
                }
            },
            how_we_work_title: "Integration Process",
            how_we_work_desc: "Plugs cleanly into your existing phone PBX or video conferencing stack.",
            how_we_work_steps: [
                { title: "Source Connection", description: "Integrate with VoIP PBX webhooks, Teams, or cloud drives." },
                { title: "Domain Glossary", description: "Boost accuracy on your product names & industry jargon." },
                { title: "CRM Field Mapping", description: "Define exact summary templates pushed to your CRM." },
                { title: "Rollout & Tuning", description: "Activate live scoring and train sales managers on insights." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about Voice AI & compliance",
            faq_items: [
                {
                    question: "How accurate is transcription for noisy phone calls?",
                    answer: "Azure Speech coupled with GPT-4o contextual correction delivers high accuracy even over telephony codecs."
                },
                {
                    question: "Can raw recordings be deleted automatically for GDPR?",
                    answer: "Yes, we configure automated retention rules to delete raw audio immediately once summaries are generated."
                },
                {
                    question: "Does it support VoIP systems like 3CX or Asterisk?",
                    answer: "Yes, any PBX supporting webhook, API, or SFTP recording exports integrates seamlessly."
                }
            ],
            cta_title: "Turn Conversations Into Insights"
        }
    },

    // 7. Automated Tender & Procurement Monitor
    {
        serviceKey: "TenderMonitor",
        navKey: "tender_monitor",
        category: "growth",
        slug: "automatizalt-palyazat-es-kozbeszerzes-figyelo",
        enSlug: "automated-tender-procurement-monitor",
        icon: "Search",
        sortOrder: 24,
        basePrice: 29000,
        hu: {
            title: "AI Pályázat- & Közbeszerzés-figyelő",
            description: "Folyamatos magyar és EU pályázati/közbeszerzési figyelés AI előminősítéssel: az Azure robot naponta átnézi az új kiírásokat és személyre szabott összefoglalót küld arról, mire érdemes beadni.",
            keywords: "pályázat figyelő ai, közbeszerzés figyelő, automatikus pályázati értesítő, ekr figyelő, szechenyi terv ai szűrő",
            megaTitle: "AI Pályázat- & Közbeszerzés Figyelő",
            megaDesc: "Automata figyelés és GPT-4o jogosultsági előszűrés",
            hero_features: [
                "Magyar és EU-s pályázatok, EKR és TED közbeszerzések figyelése",
                "GPT-4o előminősítés a saját TEÁOR, árbevétel és létszám alapján",
                "100 oldalas kiírások összefoglalása 5 áttekinthető pontba",
                "Automatikus értesítő emailben, Teamsben vagy CRM feladatként",
                "Beadási határidők és szükséges mellékletek automatikus listázása",
                "Havi akár tucatnyi elszalasztott üzleti lehetőség megfogása"
            ],
            hero_benefits: [
                {
                    title: "Elsőként Értesülsz",
                    description: "Nem egy keretszám kimerülése előtt 2 nappal hallasz a pályázatról, hanem a megjelenés napján."
                },
                {
                    title: "Nincs Felesleges Olvasgatás",
                    description: "Az AI kiszűri azokat a kiírásokat, amikre a céged jogosult és releváns referenciával bír."
                },
                {
                    title: "Azonnali Előkészítő Checklist",
                    description: "Minden találathoz megkapod a várható támogatási intenzitást, határidőt és a hiánypótlási buktatókat."
                }
            ],
            use_cases_title: "Kinek hoz azonnal milliókat?",
            use_cases_desc: "Egyetlen megnyert közbeszerzés vagy vissza nem térítendő pályázat évekre kifizeti a rendszert",
            use_cases_items: [
                {
                    title: "Közbeszerzésen Induló Beszállítók",
                    description: "Napi EKR / TED kiírások figyelése iparági kulcsszavak és CPV kódok alapján.",
                    example: "Az AI jelzi, melyik önkormányzati tenderben szerepel a te szakterületed és mekkora a minimum referencia-elvárás.",
                    roi: "Több megnyert tender, zéró manuális böngészés"
                },
                {
                    title: "Fejlesztésre Készülő KKV-k",
                    description: "GINOP Plusz, DIMOP és egyéb vissza nem térítendő támogatások azonnali figyelése.",
                    example: "A cég árbevétele és székhelye alapján azonnal szűri a választható technológiai pályázatokat.",
                    roi: "Magasabb sikeres pályázati esély"
                },
                {
                    title: "Pályázatíró & Tanácsadó Irodák",
                    description: "Több tucat ügyfélprofil egyidejű monitorozása fehér listás napi riporttal.",
                    example: "Reggel 8-kor az iroda CRM-jében ott várja a lista: melyik ügyfelet kell ma felhívni egy új pályázattal.",
                    roi: "Proaktív ügyfélkiszolgálás és extra sikerdíjak"
                },
                {
                    title: "Versenytárs- & Iparági Figyelés",
                    description: "Kihirdetett nyertesek, szerződéses árak és piaci mozgások követése.",
                    example: "Havi összesítő arról, kik és milyen áron nyertek hasonló tendereket a szektorban.",
                    roi: "Pontosabb árazási stratégia"
                }
            ],
            pricing_title: "Pályázat- & Tender Figyelő Csomagok",
            pricing_desc: "Havidíjas automatizált figyelő és AI előszűrő csomagok. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Monitor Start",
                    desc: "Heti automatizált AI összefoglaló 1 cégprofilra.",
                    price: 29000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "1 cégprofil (max. 10 kulcsszó / CPV kód)",
                        "Heti AI válogatás és 5 pontos kiírás-összefoglaló",
                        "Határidők és minimum jogosultsági feltételek kiemelése",
                        "Email értesítés a releváns új megjelenésekről"
                    ],
                    duration_label: "Ajánlott: pályázati lehetőségeket kereső KKV-knak."
                },
                detailed: {
                    name: "Tender Radar Pro",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Napi figyelés, PDF dokumentum-elemzés és GPT-4o illeszkedési pontszám.",
                    price: 59000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Napi EKR / TED / magyar és EU pályázati portál figyelés",
                        "Kiírási PDF mellékletek mély elemzése AI-val",
                        "0–100% cégre szabott illeszkedési pontszám (Match Score)",
                        "Automatikus feladat-létrehozás CRM-ben / Teamsben",
                        "Releváns beadási checklist generálása minden találathoz"
                    ],
                    duration_label: "Ajánlott: közbeszerzéseken induló cégeknek és beszállítóknak."
                },
                complex: {
                    name: "Agency / Enterprise Multi-Monitor",
                    desc: "Több ügyfélprofil, teljes dokumentum-vázlat és piaci riport.",
                    price: 119000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Akár 25 külön cégprofil / ügyfél párhuzamos figyelése",
                        "Márkázott ügyfélértesítő e-mail küldés tanácsadóknak",
                        "Nyertesek és konkurens árak havi statisztikai elemzése",
                        "Automatikus pályázati nyilatkozat / vázlat előkészítés",
                        "Egyedi webhook & API kimenet belső rendszerekhez"
                    ],
                    duration_label: "Ajánlott: pályázatíró irodáknak és vállalatcsoportoknak."
                }
            },
            how_we_work_title: "Hogyan indul el?",
            how_we_work_desc: "Néhány nap alatt beállítjuk a szűrési paramétereket és az AI profilt.",
            how_we_work_steps: [
                { title: "Cégprofil felvétele", description: "Rögzítjük a tevékenységi köröket, referenciákat és támogatási célokat." },
                { title: "Források bekötése", description: "Konfiguráljuk az állami, EU-s és szakmai adatbázis-figyelőket." },
                { title: "AI Prompt Finomhangolás", description: "Beállítjuk, mi alapján pontozza a GPT-4o a relevancia szintjét." },
                { title: "Napi Éles Üzem", description: "Az Azure robot naponta szállítja a megszűrt, érthető összefoglalókat." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a tender figyelő rendszerről",
            faq_items: [
                {
                    question: "Melyik adatbázisokat figyeli a rendszer?",
                    answer: "Az EKR-t (Elektronikus Közbeszerzési Rendszer), a magyar pályázati portálokat (palyazat.gov.hu) és az EU-s TED közbeszerzési értesítőt egyaránt."
                },
                {
                    question: "Meg tudja állapítani a rendszer, hogy megfelelünk-e a feltételeknek?",
                    answer: "Igen! A letöltött felhívás PDF-ekből az AI kinyeri az árbevételi, létszám- és referenciakövetelményeket, majd összeveti a cégadataiddal."
                },
                {
                    question: "Pályázatírást is vállaltok?",
                    answer: "Mi a technológiai szűrést, az AI elemzést és a dokumentum-előkészítést adjuk; igény esetén bevonjuk partner pályázatíró szakértőinket is."
                }
            ],
            cta_title: "Ne maradj le a következő tenderedről"
        },
        en: {
            title: "Automated Tender & Procurement AI Monitor",
            description: "Continuous Hungarian and EU tender & procurement tracking with GPT-4o pre-qualification: our Azure bot scans new calls daily and alerts you only on bids matching your company profile.",
            keywords: "tender monitoring ai, public procurement alert, automated rfp scanner, eu grant monitoring",
            megaTitle: "Tender & Procurement AI Monitor",
            megaDesc: "Daily portal scanning & GPT-4o eligibility matching",
            hero_features: [
                "Scans EU TED, national grants & public procurement portals",
                "GPT-4o eligibility scoring based on revenue & headcount",
                "100-page tender PDFs distilled into 5 clear bullet points",
                "Real-time alerts via Email, Teams or CRM pipeline",
                "Automated deadline & required attachment checklists",
                "Never miss high-value public contracts or grants"
            ],
            hero_benefits: [
                {
                    title: "First-Mover Advantage",
                    description: "Spot opportunities on publication day rather than hearing days before deadline."
                },
                {
                    title: "Zero PDF Fatigue",
                    description: "AI filters out irrelevant calls and surfaces only tenders you qualify to win."
                },
                {
                    title: "Actionable Checklists",
                    description: "Get estimated grant percentages, caps, and compliance traps extracted automatically."
                }
            ],
            use_cases_title: "Who Benefits Most?",
            use_cases_desc: "A single won bid pays back years of automated intelligence",
            use_cases_items: [
                {
                    title: "Public Procurement Bidders",
                    description: "Track daily CPV codes and sector tenders with eligibility filtering.",
                    example: "Receive alerts showing minimum reference values before dedicating bid writers.",
                    roi: "Higher bid volume with less research waste"
                },
                {
                    title: "Growth-Oriented SMBs",
                    description: "Monitor EU and national digitalization, R&D and green transition grants.",
                    example: "Automatically filters programs aligned with your company size and region.",
                    roi: "Capture non-refundable capital grants"
                },
                {
                    title: "Consulting & Grant Agencies",
                    description: "Track dozens of client profiles simultaneously with branded alerts.",
                    example: "Every morning consultants see exactly which clients qualify for new funds.",
                    roi: "Proactive upsell & higher success fees"
                },
                {
                    title: "Competitor Award Tracking",
                    description: "Follow awarded contracts, winning vendors and benchmark pricing.",
                    example: "Monthly intelligence digest showing sector award patterns.",
                    roi: "Sharper competitive bid pricing"
                }
            ],
            pricing_title: "Tender Monitor Packages",
            pricing_desc: "Monthly automated tracking & AI pre-screening tiers. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Monitor Start",
                    desc: "Weekly AI tender summaries for 1 company profile.",
                    price: 29000,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "1 company profile (up to 10 keywords / CPV codes)",
                        "Weekly AI-curated digest with 5-point briefs",
                        "Highlighted deadlines & minimum criteria",
                        "Email notifications on relevant calls"
                    ],
                    duration_label: "Best for SMBs exploring grants & bids."
                },
                detailed: {
                    name: "Tender Radar Pro",
                    badge: "Most popular",
                    popular: true,
                    desc: "Daily scanning, PDF analysis & GPT-4o Match Score.",
                    price: 59000,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "Daily national & EU TED portal scanning",
                        "Deep AI analysis of full PDF tender documentation",
                        "0–100% custom Match Score against your profile",
                        "Direct push into CRM / Microsoft Teams",
                        "Automated submission readiness checklist"
                    ],
                    duration_label: "Best for active B2B suppliers & service bidders."
                },
                complex: {
                    name: "Agency Multi-Monitor",
                    desc: "Multi-client tracking & competitive market analytics.",
                    price: 119000,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "Up to 25 distinct client profiles monitored",
                        "White-label alert workflows for consulting firms",
                        "Competitor award & benchmark pricing reports",
                        "AI proposal outline & compliance draft prep",
                        "Custom webhook & API data output"
                    ],
                    duration_label: "Best for grant writers & enterprise groups."
                }
            },
            how_we_work_title: "Getting Started",
            how_we_work_desc: "Configured cleanly around your capabilities within days.",
            how_we_work_steps: [
                { title: "Profile Setup", description: "Capture company metrics, licenses & past references." },
                { title: "Source Linking", description: "Hook up national and EU procurement feeds." },
                { title: "AI Match Rules", description: "Calibrate GPT-4o scoring weights for relevance." },
                { title: "Daily Intelligence", description: "Receive structured briefings straight in your inbox or CRM." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about automated tender monitoring",
            faq_items: [
                {
                    question: "Which tender portals are monitored?",
                    answer: "EU TED, Hungarian EKR public procurement and national grant portals are all covered."
                },
                {
                    question: "Can AI verify if we meet financial turnover minimums?",
                    answer: "Yes, it reads eligibility PDFs and matches turnover and reference criteria against your profile."
                },
                {
                    question: "Does the output integrate into our CRM?",
                    answer: "Yes, matches can automatically generate deals or tasks in your CRM or Teams."
                }
            ],
            cta_title: "Capture Your Next Tender"
        }
    }
]
