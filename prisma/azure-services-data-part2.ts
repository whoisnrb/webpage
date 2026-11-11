import type { AzureServiceDefinition } from "./azure-services-data"

export const NEW_AZURE_SERVICES_PART2: AzureServiceDefinition[] = [
    // 8. Ransomware-Proof Disaster Recovery (DRaaS)
    {
        serviceKey: "DisasterRecoveryDRaaS",
        navKey: "draas",
        category: "security_cloud",
        slug: "zsarolovirus-vedett-katasztrofa-helyreallitas-draas",
        enSlug: "ransomware-proof-disaster-recovery-draas",
        icon: "Database",
        popular: true,
        sortOrder: 25,
        basePrice: 49000,
        hu: {
            title: "Zsarolóvírus-Védett DRaaS Helyreállítás",
            description: "Nem csak adatmentés, hanem azonnali üzletmenet-folytonosság (Azure Site Recovery + Immutable WORM Storage): támadás vagy szerverleállás esetén 30 percen belül elindul a teljes szervered az Azure felhőben.",
            keywords: "draas szolgáltatás, katasztrófa helyreállítás felhő, zsarolóvírus elleni backup, immutable backup azure, azure site recovery",
            megaTitle: "Zsarolóvírus-Védett DRaaS",
            megaDesc: "Törölhetetlen WORM backup & 30 perces felhős szerver-átállás",
            hero_features: [
                "Immutable (WORM) tárhely: még rendszergazdai jelszóval sem törölhető",
                "Folyamatos virtuális gép / szerver replikáció Azure-ba",
                "Katasztrófa esetén < 30 perces szerverindítás a felhőben (RTO)",
                "Titkosított VPN összeköttetés az irodai hálózattal (Site-to-Site)",
                "Negyedéves izolált próba-visszaállítás (DR Drill) jegyzőkönyvvel",
                "Valós védelem zsarolóvírus, tűzeset vagy hardverhalál ellen"
            ],
            hero_benefits: [
                {
                    title: "Zsarolóvírus-Álló Mentés",
                    description: "A támadók először mindig a biztonsági mentést törlik — a WORM zárolt Azure tárhelyhez viszont fizikailag sem férnek hozzá."
                },
                {
                    title: "Nincs Többhetes Leállás",
                    description: "Ha leáll a fizikai szervered vagy megsérül az ERP gép, nem vársz napokat új vasra: az Azure klón átveszi a munkát."
                },
                {
                    title: "Tesztelt Garancia",
                    description: "Nem csak reménykedünk, hogy működik a mentés: negyedévente éles izolált teszten bizonyítjuk a visszaállíthatóságot."
                }
            ],
            use_cases_title: "Miben több a DRaaS a sima backupnál?",
            use_cases_desc: "A mentés csak másolat — a DRaaS maga a bekapcsolható tartalék erőmű",
            use_cases_items: [
                {
                    title: "Zsarolóvírus Elleni Védelem (WORM)",
                    description: "Ha mégis betörne egy vírus a belső hálózatra, a felhőben zárolt korábbi állapot érintetlen marad.",
                    example: "A fertőzés előtti 1 órával korábbi tiszta szerverkép visszaállítása izolált felhő zónába.",
                    roi: "Nulla váltságdíj-fizetés, biztos túlélés"
                },
                {
                    title: "Irodai Szerver & ERP Failover",
                    description: "Helyi Hyper-V, VMware vagy fizikai Windows/Linux szerverek folyamatos replikációja.",
                    example: "Áramszünet vagy RAID hiba esetén a dolgozók VPN-en keresztül azonnal az Azure-ban futó ERP-re csatlakoznak.",
                    roi: "Akár milliós kieső árbevétel megmentése órák alatt"
                },
                {
                    title: "Auditált DR Tesztek (ISO / NIS2)",
                    description: "Hatósági vagy partneri elvárás az igazolt üzletmenet-folytonossági terv (BCP).",
                    example: "Izolált homokozóban elindított szerver, dokumentált visszaállítási időkkel PDF-ben.",
                    roi: "Teljes NIS2 üzletmenet-folytonossági megfelelés"
                },
                {
                    title: "Visszaállás Eredeti Hardverre",
                    description: "Miután az irodai hálózat megtisztult vagy megjött az új szerver, vissza-szinkronizáljuk a friss adatokat.",
                    example: "Zökkenőmentes visszaállás a felhőben keletkezett új számlák és rendelések elvesztése nélkül.",
                    roi: "Teljes adat-integritás oda-vissza"
                }
            ],
            pricing_title: "DRaaS & Immutable Mentés Csomagok",
            pricing_desc: "Megbízható felhős helyreállítás EU-s Azure adatközpontban. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Immutable WORM Vault",
                    desc: "Törölhetetlen, zsarolóvírus-védett felhős biztonsági mentés.",
                    price: 49000,
                    sub: "Ft / hó (1 TB Immutable Azure Storage)",
                    features: [
                        "1 TB WORM (Write-Once-Read-Many) zárolt tárhely",
                        "Napi automatikus titkosított mentés (szerver + DB)",
                        "Módosítás és törlés elleni zárolási szabályzat",
                        "Sikeres/sikertelen mentés napi monitorozása",
                        "Havi automatikus helyreállítási státusz riport"
                    ],
                    duration_label: "Ajánlott: kisebb szerverrel, NAS-szal rendelkező cégeknek."
                },
                detailed: {
                    name: "Rapid Cloud Failover (DRaaS)",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Folyamatos VM replikáció és 30 perces Azure szerver-átkapcsolás.",
                    price: 129000,
                    sub: "Ft / hó (max. 2 kritikus szerver VM)",
                    features: [
                        "Akár 2 db üzletkritikus szerver élő Azure replikációja",
                        "< 30 perces visszaállítási idő (RTO) felhőben indítva",
                        "Immutable WORM mentési réteg beépítve",
                        "Előre kiépített Site-to-Site VPN failover hálózat",
                        "Negyedéves izolált próba-visszaállítási jegyzőkönyv"
                    ],
                    duration_label: "Ajánlott: saját ERP/számlázó/fájlszervert futtató KKV-knak."
                },
                complex: {
                    name: "Enterprise Zero-Loss Cluster",
                    desc: "Többszerveres infrastruktúra < 15 perces RPO/RTO SLA-val.",
                    price: 249000,
                    sub: "Ft / hó (egyedi szerverszám szerint)",
                    features: [
                        "Korlátlan VM / SQL klaszter folyamatos replikációja",
                        "< 15 perces RPO/RTO katasztrófa-terv és automatizált boot-sorrend",
                        "Dedikált izolált felhő-hálózat és tűzfal failover",
                        "0–24 mérnöki beavatkozás katasztrófahelyzet esetén",
                        "Teljes NIS2 / ISO 27001 BCP dokumentáció"
                    ],
                    duration_label: "Ajánlott: gyártó, logisztikai és közepes nagyvállalatoknak."
                }
            },
            how_we_work_title: "Hogyan építjük ki a tartalék rendszert?",
            how_we_work_desc: "A meglévő működés lassítása nélkül húzzuk fel a háttérben a replikációt.",
            how_we_work_steps: [
                { title: "Függőség-térkép", description: "Felmérjük a szervereket, adatbázisokat és a VPN / DNS útvonalakat." },
                { title: "WORM & Replikáció", description: "Bekötjük a titkosított replikációt és a törölhetetlen tárhelyet." },
                { title: "Failover Hálózat", description: "Felkonfiguráljuk az Azure VNet + VPN kapcsolatot az azonnali eléréshez." },
                { title: "Első Éles Próba", description: "Elkülönített hálózatban leteszteljük az éles indítást és átadjuk a tervet." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Minden a felhős katasztrófa-helyreállításról",
            faq_items: [
                {
                    question: "Miben különbözik ez egy külső merevlemezes vagy sima felhős mentéstől?",
                    answer: "Ha egy zsarolóvírus megfertőzi a hálózatodat, a rácsatlakoztatott NAS-t és a sima felhőfiókot is titkosítja. Az Immutable tárhely viszont matematikailag zárolt, ráadásul a DRaaS egy gombnyomásra el is indítja a működő szervereket helyetted."
                },
                {
                    question: "Működik Hyper-V, VMware és fizikai szerverekről is?",
                    answer: "Igen, az Azure Site Recovery és a modern replikációs motorunk Windows és Linux virtuális vagy fizikai gépeket is támogat."
                },
                {
                    question: "Csak vészhelyzetben indulnak el a drága felhős szerverek?",
                    answer: "Igen! Normál üzemben csak replikált tárhely fut alacsony költséggel, a teljes számítási kapacitás csak éles leállás vagy negyedéves próba idején pörög fel."
                }
            ],
            cta_title: "Tedd elpusztíthatatlanná a céges rendszereidet"
        },
        en: {
            title: "Ransomware-Proof Disaster Recovery (DRaaS)",
            description: "More than backup — true business continuity powered by Azure Site Recovery & Immutable WORM Storage: spin up cloned production servers in Azure within 30 minutes of ransomware or hardware failure.",
            keywords: "draas azure, ransomware immutable backup, disaster recovery as a service, azure site recovery",
            megaTitle: "Ransomware-Proof DRaaS",
            megaDesc: "Immutable WORM vault & 30-min cloud server failover",
            hero_features: [
                "Immutable (WORM) cloud vault — undeletable even with stolen admin keys",
                "Continuous server & VM replication to EU Azure",
                "Under 30-minute server boot time in the cloud upon outage",
                "Pre-wired encrypted Site-to-Site VPN for instant staff reconnection",
                "Quarterly isolated failover drills with dated compliance reports",
                "Bulletproof recovery from ransomware, fire, or hardware failure"
            ],
            hero_benefits: [
                {
                    title: "Ransomware Immunity",
                    description: "Attackers target backups first — WORM-locked storage prevents tampering or premature deletion."
                },
                {
                    title: "Hours Saved, Not Weeks",
                    description: "Never wait days for replacement hardware: spin up exact cloud replicas of your ERP instantly."
                },
                {
                    title: "Verified Recovery",
                    description: "Quarterly sandbox failover drills prove recovery timelines before disaster strikes."
                }
            ],
            use_cases_title: "Why DRaaS Beats Basic Backup",
            use_cases_desc: "Backups store cold files — DRaaS keeps a ready-to-run cloud standby of your company",
            use_cases_items: [
                {
                    title: "Clean-Room Ransomware Recovery",
                    description: "Boot servers from immutable snapshots taken minutes prior to encryption.",
                    example: "Restore clean ERP state into an isolated cloud subnet with zero ransom paid.",
                    roi: "Zero ransom exposure & survived outages"
                },
                {
                    title: "On-Prem Server & ERP Failover",
                    description: "Continuous replication for local Hyper-V, VMware, or bare-metal servers.",
                    example: "Staff reconnect seamlessly via VPN to Azure replicas during office outages.",
                    roi: "Protect daily operational revenue"
                },
                {
                    title: "ISO / NIS2 BCP Testing Proof",
                    description: "Satisfy strict auditor requirements for verified recovery drills.",
                    example: "Isolated cloud test produces signed RTO/RPO audit evidence.",
                    roi: "Instant audit compliance"
                },
                {
                    title: "Seamless Failback",
                    description: "Sync new transactions cleanly back once local hardware is rebuilt.",
                    example: "Zero invoices or bookings lost during recovery periods.",
                    roi: "End-to-end data integrity"
                }
            ],
            pricing_title: "DRaaS & Immutable Vault Tiers",
            pricing_desc: "Enterprise business continuity hosted in EU Azure regions. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Immutable WORM Vault",
                    desc: "Undeletable ransomware-proof cloud storage vault.",
                    price: 49000,
                    sub: "HUF / mo (1 TB Immutable Azure Storage)",
                    features: [
                        "1 TB WORM-locked Azure cloud vault",
                        "Daily encrypted snapshots (servers & databases)",
                        "Hardware-enforced deletion/tampering locks",
                        "Daily automated health & integrity monitoring",
                        "Monthly backup readiness summary report"
                    ],
                    duration_label: "Best for small offices & NAS/server protection."
                },
                detailed: {
                    name: "Rapid Cloud Failover (DRaaS)",
                    badge: "Most popular",
                    popular: true,
                    desc: "Live VM replication & <30 min Azure failover readiness.",
                    price: 129000,
                    sub: "HUF / mo (up to 2 critical servers)",
                    features: [
                        "Live Azure replication for up to 2 core servers",
                        "Under 30-min Recovery Time Objective (RTO)",
                        "Built-in Immutable WORM retention layer",
                        "Pre-built Azure VNet & VPN emergency routing",
                        "Quarterly isolated failover test with PDF report"
                    ],
                    duration_label: "Best for SMBs running critical ERP or file servers."
                },
                complex: {
                    name: "Enterprise Zero-Loss Cluster",
                    desc: "Multi-VM orchestration with <15 min RPO/RTO SLA.",
                    price: 249000,
                    sub: "HUF / mo (custom server scale)",
                    features: [
                        "Multi-server & SQL database synchronized recovery plans",
                        "Under 15-min RPO/RTO orchestration & sequenced boot",
                        "Dedicated isolated recovery enclave & firewall",
                        "24/7 engineering mobilization upon outage",
                        "Full NIS2 / ISO 27001 BCP compliance documentation"
                    ],
                    duration_label: "Best for manufacturing, logistics & multi-site orgs."
                }
            },
            how_we_work_title: "How We Deploy DRaaS",
            how_we_work_desc: "Implemented smoothly alongside your running infrastructure.",
            how_we_work_steps: [
                { title: "Dependency Audit", description: "Map core servers, databases, and network routes." },
                { title: "Vault & Replication", description: "Deploy WORM storage locks and encrypted Azure syncing." },
                { title: "Emergency VNet", description: "Wire encrypted VPN gateways for seamless user access." },
                { title: "Initial DR Drill", description: "Perform a clean sandbox boot and document RTO speeds." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Everything about immutable backups and cloud failover",
            faq_items: [
                {
                    question: "How is this safer than NAS or regular cloud storage?",
                    answer: "Ransomware encrypts mapped network drives too. Immutable WORM storage cannot be wiped even with admin credentials, and DRaaS spins up live compute immediately."
                },
                {
                    question: "Does it support Hyper-V, VMware and physical boxes?",
                    answer: "Yes, both major hypervisors and physical Windows/Linux hosts are supported."
                },
                {
                    question: "Do we pay full Azure VM compute fees all month?",
                    answer: "No. Compute VMs remain deallocated until an actual failover or quarterly test runs."
                }
            ],
            cta_title: "Future-Proof Your Operations"
        }
    },

    // 9. 24/7 Synthetic Webshop & Checkout Monitoring
    {
        serviceKey: "SyntheticMonitoring",
        navKey: "synthetic_mon",
        category: "security_cloud",
        slug: "szintetikus-webshop-es-fizetes-monitoring",
        enSlug: "synthetic-webshop-checkout-monitoring",
        icon: "Activity",
        sortOrder: 26,
        basePrice: 19900,
        hu: {
            title: "0–24 Webshop & Pénztár Szintetikus Monitoring",
            description: "Nem csak a szerver pinget nézi: robotböngészőnk 5 percenként végigkattintja a termékoldalt, kosárba tesz és ellenőrzi a pénztár/fizetés/számlázó API működését — AI hibanapló elemzéssel.",
            keywords: "webshop monitoring, fizetés tesztelés automatikus, szintetikus monitoring playwright, downtime riasztás, uptime monitoring",
            megaTitle: "0–24 Webshop & Pénztár Figyelő",
            megaDesc: "Automata vásárlói robot-tesztek és AI hiba-elemzés",
            hero_features: [
                "Valódi böngészős (Playwright) kosár- és pénztár-folyamat teszt",
                "Fizetési átjárók (Stripe, SimplePay, Barion) válaszidő-figyelése",
                "Azonnali riasztás SMS, Telegram, Slack vagy Teams csatornán",
                "Képernyőfotó és konzolhiba-mentés a leállás pillanatában",
                "AI alapú gyökérok-összefoglaló (pl. lejárt API kulcs, lassú DB)",
                "Havi rendelkezésreállási (SLA) és sebesség-grafikon riport"
            ],
            hero_benefits: [
                {
                    title: "Tudsz Róla a Vevők Előtt",
                    description: "Vasárnap este egy elakadt pénztár gombot előbb vesz észre a robotunk 5 perc alatt, mint hogy az első vevő elmenekülne."
                },
                {
                    title: "Több Mint Sima Ping",
                    description: "Egy weblap mutathat '200 OK'-t úgy is, hogy a Kosár gomb JS hiba miatt már nem működik — mi a valódi gombnyomást teszteljük."
                },
                {
                    title: "Kampányidőszaki Nyugalom",
                    description: "Fizetett Facebook/Google Ads hirdetések alatt garantáltan nem égeted a pénzt törött checkout oldalra."
                }
            ],
            use_cases_title: "Milyen rejtett hibákat fog meg?",
            use_cases_desc: "A webshopok legnagyobb bevételkiesése nem a teljes leállás, hanem a törött fizetési vagy bejelentkezési lépések",
            use_cases_items: [
                {
                    title: "WordPress / Plugin Frissítés Utáni Pénztár-hiba",
                    description: "Egy éjszakai plugin-frissítés gyakran észrevétlenül eltöri a 'Tovább a fizetéshez' gombot.",
                    example: "A robot teszteli a kosárba helyezést és a pénztár betöltését; ha nem találja a gombot, azonnal képernyőfotóval riaszt.",
                    roi: "Azonnali megmentett kampánybüdzsé"
                },
                {
                    title: "Számlázó & Futárszolgálati API Figyelés",
                    description: "Számlázz.hu, Foxpost, GLS és fizetési webhook végpontok elérhetőségének monitorozása.",
                    example: "Figyeljük, ha valamelyik külső partner API-ja időtúllépéssel válaszol és leblokkolja a pénztárat.",
                    roi: "0 beragadt vagy kiállítatlan rendelés"
                },
                {
                    title: "SaaS Alkalmazás Bejelentkezési Teszt",
                    description: "Ügyfélportálok és webes szoftverek login + dashboard betöltési idejének mérése.",
                    example: "Percre pontos riasztás, ha a bejelentkezési API 5 másodpercnél lassabbra romlik.",
                    roi: "Magasabb ügyfélmegtartás és gyorsabb reakció"
                },
                {
                    title: "Adatbázis & Memória Lassulás Korai Jelei",
                    description: "LCP / TTFB válaszidő trendek figyelése, hogy még az összeomlás előtt lássuk a túlterhelést.",
                    example: "Figyelmeztetés, amikor az átlagos válaszidő 300 ms-ról 2.5 másodpercre kúszik fel.",
                    roi: "Megelőzött szerverösszeomlás csúcsidőben"
                }
            ],
            pricing_title: "Szintetikus Monitoring Csomagok",
            pricing_desc: "24/7 felügyelet közvetlenül az Azure felhőcsomópontjainkról. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Uptime Pulse",
                    desc: "1 perces alap URL, API és SSL elérhetőségi figyelés.",
                    price: 19900,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Maximum 5 URL / API végpont 1 perces figyelése",
                        "Azonnali riasztás e-mailben és Telegram/Slack-en",
                        "SSL lejárat és DNS változás figyelés",
                        "Lassulási küszöbérték riasztás (pl. > 3 mp)",
                        "Havi Uptime SLA % statisztika"
                    ],
                    duration_label: "Ajánlott: bemutatkozó oldalaknak, portáloknak."
                },
                detailed: {
                    name: "Checkout Guard Robot",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Valódi böngészős vásárlási út + AI hiba-diagnosztika.",
                    price: 39900,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "5 percenkénti Playwright robot kosár + pénztár teszt",
                        "Képernyőfotó és JS konzolhiba rögzítése hiba esetén",
                        "AI hibaelemző összefoglaló a gyors javításhoz",
                        "SMS / Telefonos hívás riasztás kritikus kiesésnél",
                        "Fizetési & számlázó végpontok ellenőrzése"
                    ],
                    duration_label: "Ajánlott: WooCommerce, Shopify és egyedi webshopoknak."
                },
                complex: {
                    name: "Multi-Flow Enterprise QA",
                    desc: "Több régiós tesztek, belépés + egyedi üzleti folyamatok.",
                    price: 89000,
                    sub: "Ft / hó (ÁFA-mentes)",
                    features: [
                        "Akár 10 komplex bejelentkezéses / vásárlási forgatókönyv",
                        "Párhuzamos tesztelés EU és globális régiókból",
                        "Teljesítmény-trendek (Core Web Vitals) folyamatos mérése",
                        "Automata hiba-jegy nyitás a fejlesztőcsapat felé",
                        "Dedikált havi optimalizálási konzultáció"
                    ],
                    duration_label: "Ajánlott: nagy forgalmú SaaS rendszereknek és nagy webáruházaknak."
                }
            },
            how_we_work_title: "Hogyan működik a robot?",
            how_we_work_desc: "Valódi vevőként, tesztadatokkal ellenőrzi a rendszert — valós rendelés és bankkártya-terhelés nélkül.",
            how_we_work_steps: [
                { title: "Útvonalak kijelölése", description: "Megjelöljük a legkritikusabb konverziós lépéseket (kosár, pénztár, login)." },
                { title: "Playwright Szkript", description: "Megírjuk a böngésző-automatizációs robotot teszt-termékekre." },
                { title: "Riasztás Bekötése", description: "Összekötjük Telegrammal, Teamszel, emaillel vagy SMS kapuval." },
                { title: "24/7 Őrszolgálat", description: "A rendszer éjjel-nappal őrködik és azonnal rögzíti a hibák okát." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a szintetikus tesztelő robotról",
            faq_items: [
                {
                    question: "Nem fogja teleszemetelni a Google Analyticsemet és a megrendeléseimet a tesztrobot?",
                    answer: "Nem! Kizárólag a pénztár lépésig tesztelünk (fizetés indítása előtt megállunk), illetve speciális URL/User-Agent paraméterrel kiszűrhető az analitikából."
                },
                {
                    question: "Látjuk majd pontosan, mi okozta a leállást?",
                    answer: "Igen, hiba pillanatában a robot elmenti a böngésző képernyőfotóját, a hálózati HTTP hibakódokat, a JS konzolüzeneteket és az AI összefoglalóját."
                },
                {
                    question: "Mennyi idő alatt állítható be egy webshopra?",
                    answer: "Tipikusan 24–48 órán belül megírjuk a testreszabott kosár- és pénztártesztet és élesítjük a riasztást."
                }
            ],
            cta_title: "Védd meg a webshopod bevételét"
        },
        en: {
            title: "24/7 Synthetic Webshop & Checkout Monitoring",
            description: "More than ping checks: headless Playwright bots click through your product pages, add items to cart, and verify checkout, payment gateways & billing APIs every 5 minutes with AI diagnostics.",
            keywords: "synthetic monitoring playwright, ecommerce checkout monitoring, uptime alerting, broken checkout detection",
            megaTitle: "Synthetic Shop & Checkout Monitor",
            megaDesc: "Automated buyer bots testing cart & checkout flows 24/7",
            hero_features: [
                "Real browser (Playwright) add-to-cart & checkout verification",
                "Payment & shipping API latency monitoring",
                "Instant SMS, Telegram, Slack & Teams incident alerts",
                "Exact failure screenshots & console error captures",
                "GPT-4o root-cause diagnostics on downtime events",
                "Monthly SLA uptime & Core Web Vitals reports"
            ],
            hero_benefits: [
                {
                    title: "Know Before Customers Do",
                    description: "Catch a broken Sunday-night checkout button in 5 minutes instead of losing Monday orders."
                },
                {
                    title: "Beyond Simple Uptime Pings",
                    description: "Sites often return HTTP 200 even when JavaScript breaks the Pay Now button — our bot clicks it."
                },
                {
                    title: "Safe Ad Spend",
                    description: "Stop burning paid Facebook and Google Ads clicks onto silently broken landing forms."
                }
            ],
            use_cases_title: "Hidden Outages Caught Early",
            use_cases_desc: "Most ecommerce revenue loss stems from broken user flows, not full server crashes",
            use_cases_items: [
                {
                    title: "Post-Update Checkout Breakage",
                    description: "Detect when overnight CMS plugin updates break cart calculations.",
                    example: "Bot fails to locate the checkout submit button and pages engineering with screenshots.",
                    roi: "Protect ad budgets & checkout revenue"
                },
                {
                    title: "Payment & Carrier API Failures",
                    description: "Verify Stripe, local banks, and courier parcel-locker pickers continually.",
                    example: "Alert instantly when third-party shipping map widgets time out.",
                    roi: "Zero abandoned checkouts from broken pickers"
                },
                {
                    title: "SaaS Login & App Health",
                    description: "Monitor full user login and portal dashboard render times.",
                    example: "Alerts trigger when authenticated page loads degrade past 3 seconds.",
                    roi: "Higher user retention"
                },
                {
                    title: "Early Latency Creep Warning",
                    description: "Track TTFB and DB query sluggishness before timeouts strike.",
                    example: "Detect gradual CPU or memory exhaustion prior to peak hours.",
                    roi: "Preventive scaling before crashes"
                }
            ],
            pricing_title: "Synthetic Monitoring Packages",
            pricing_desc: "24/7 monitoring running on EU Azure runners. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Uptime Pulse",
                    desc: "1-minute URL, API & SSL endpoint availability checks.",
                    price: 19900,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "Up to 5 URLs / API endpoints checked every 60s",
                        "Instant email, Slack & Telegram notifications",
                        "SSL expiry & DNS drift monitoring",
                        "Response-time threshold alerts",
                        "Monthly SLA percentage report"
                    ],
                    duration_label: "Best for corporate websites & portfolios."
                },
                detailed: {
                    name: "Checkout Guard Robot",
                    badge: "Most popular",
                    popular: true,
                    desc: "Full browser buyer-flow test & AI failure diagnostics.",
                    price: 39900,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "5-minute Playwright add-to-cart & checkout flow",
                        "Instant failure screenshot & browser log snapshot",
                        "AI plain-language root-cause summary",
                        "Critical SMS / phone escalation alerts",
                        "Payment gateway & invoicing endpoint checks"
                    ],
                    duration_label: "Best for WooCommerce, Shopify & custom webshops."
                },
                complex: {
                    name: "Multi-Flow Enterprise QA",
                    desc: "Multi-region testing, authenticated user journeys & SLA.",
                    price: 89000,
                    sub: "HUF / mo (VAT-free)",
                    features: [
                        "Up to 10 multi-step login / purchase journeys",
                        "Regional verification across EU and global nodes",
                        "Continuous Core Web Vitals trend tracking",
                        "Automated engineering ticket creation",
                        "Monthly performance consulting session"
                    ],
                    duration_label: "Best for high-traffic SaaS apps & enterprise stores."
                }
            },
            how_we_work_title: "How It Runs",
            how_we_work_desc: "Tests full customer journeys cleanly without charging real cards or polluting orders.",
            how_we_work_steps: [
                { title: "Journey Mapping", description: "Select critical revenue flows (cart, checkout, auth)." },
                { title: "Playwright Scripting", description: "Author resilient headless checks using safe test items." },
                { title: "Alert Escalation", description: "Wire Telegram, Slack, Teams, SMS & email routing." },
                { title: "24/7 Overwatch", description: "Continuous monitoring with instant forensic screenshots." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details on synthetic transaction monitoring",
            faq_items: [
                {
                    question: "Will test bots clutter our orders or Google Analytics?",
                    answer: "No. Flows halt right before live payment submission and tag requests cleanly so analytics filters them out."
                },
                {
                    question: "What evidence do we get when an alert fires?",
                    answer: "Exact error screenshots, HTTP waterfall failures, JS console logs and AI diagnostics."
                },
                {
                    question: "How fast can this go live?",
                    answer: "Custom checkout tests are typically scripted and live within 24–48 hours."
                }
            ],
            cta_title: "Safeguard Your Checkout Revenue"
        }
    },

    // 10. Black Friday & Campaign Load Testing
    {
        serviceKey: "LoadTesting",
        navKey: "load_testing",
        category: "security_cloud",
        slug: "kampany-elotti-terhelesteszteles-load-testing",
        enSlug: "campaign-load-testing-performance-audit",
        icon: "Gauge",
        sortOrder: 27,
        basePrice: 149000,
        hu: {
            title: "Kampány Előtti Terheléstesztelés (Load Testing)",
            description: "Black Friday, TV-megjelenés vagy nagy hirdetési kampány előtt szimulálunk 1.000–15.000 egyidejű virtuális felhasználót (Azure Load Testing), és megmutatjuk pontosan, hol akad el a szervered.",
            keywords: "terheléstesztelés, load testing webshop, black friday felkészítés, teljesítmény audit, azure load testing",
            megaTitle: "Terheléstesztelés (Load Testing)",
            megaDesc: "Black Friday & kampány előtti stresszteszt 15.000 főig",
            hero_features: [
                "Több ezer egyidejű virtuális vásárló szimulálása Azure-ból",
                "Valósághű forgatókönyvek: böngészés, szűrés, kosár, pénztár",
                "Adatbázis, CPU, RAM és külső API szűk keresztmetszetek feltárása",
                "Részletes vezetői és fejlesztői PDF teljesítmény-jelentés",
                "Konkrét gyorsítási javaslatok (Redis cache, DB indexek, CDN)",
                "Ütemezett éjszakai tesztfutás ügyfelek zavarása nélkül"
            ],
            hero_benefits: [
                {
                    title: "Nulla Összeomlás Csúcsidőben",
                    description: "Ne az év legnagyobb akciójának első percében derüljön ki, hogy 200 egyidejű kosárnál elfogy az adatbázis-kapcsolat."
                },
                {
                    title: "Pontos Kapacitáshatár",
                    description: "Feketén-fehéren látni fogod: jelenleg hány egyidejű felhasználót bír el a rendszered lassulás nélkül."
                },
                {
                    title: "Mérhető Gyorsítás",
                    description: "A teszt alapján elvégzett optimalizálások után ismételt teszttel igazoljuk a 3–10x nagyobb teherbírást."
                }
            ],
            use_cases_title: "Mikor kötelező a terhelésteszt?",
            use_cases_desc: "Egy összeomló webshop több millió forint elmaradt forgalmat és elégetett hirdetést jelent",
            use_cases_items: [
                {
                    title: "Black Friday & Szezonális Akciók",
                    description: "Webáruházak felkészítése a normál forgalom 5–20-szorosára.",
                    example: "Szimuláljuk a hírlevél-kiküldés utáni 15 perces rohamot 3 000 egyidejű vásárlóval.",
                    roi: "Zökkenőmentes csúcsforgalmi bevétel"
                },
                {
                    title: "Új Szoftver / Portál Élesítése Előtt",
                    description: "Frissen fejlesztett egyedi rendszerek és API-k vizsgáztatása éles indulás előtt.",
                    example: "Megtaláljuk a N+1 adatbázis lekérdezéseket és memória-szivárgásokat még az átadás előtt.",
                    roi: "Megbízható indulás, elégedett első felhasználók"
                },
                {
                    title: "TV-Szereplés (pl. Cápák Között)",
                    description: "Médiaszereplés másodpercében egyszerre több tízezer látogató zúdul az oldalra.",
                    example: "Előzetes Cloudflare caching + stresszteszt, hogy egyetlen néző se kapjon 502-es hibát.",
                    roi: "A média-figyelem 100%-os konverziója"
                },
                {
                    title: "Belső Rendszerek & Jegyértékesítés",
                    description: "Rendezvény-regisztrációk, iskolai/sport nevezések és jegyportálok nyitási csúcsa.",
                    example: "Az egyszerre történő bejelentkezések és foglalási zárások (race condition) ellenőrzése.",
                    roi: "Hiba- és összeomlásmentes regisztráció"
                }
            ],
            pricing_title: "Terheléstesztelés Csomagok",
            pricing_desc: "Projektalapú stressztesztek részletes mérnöki diagnosztikával. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Stress Check Start",
                    desc: "Célzott terhelésteszt max. 1.000 egyidejű felhasználóval.",
                    price: 149000,
                    sub: "egyszeri díj (ÁFA-mentes)",
                    features: [
                        "Max. 1 000 egyidejű virtuális felhasználó szimulálása",
                        "Főoldal + kulcs aloldalak / API végpontok tesztelése",
                        "Válaszidő, hibaarány és áteresztőképesség grafikonok",
                        "Összefoglaló PDF teljesítmény-jelentés javaslatokkal"
                    ],
                    duration_label: "Ajánlott: kampányra készülő kisebb cégeknek, landing oldalaknak."
                },
                detailed: {
                    name: "Campaign Ready Audit",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Teljes vásárlási folyamat teszt 5.000 egyidejű felhasználóval.",
                    price: 290000,
                    sub: "egyszeri díj (ÁFA-mentes)",
                    features: [
                        "Akár 5 000 egyidejű virtuális felhasználó Azure-ból",
                        "Valós böngészős/API kosár + pénztár forgatókönyv",
                        "Szerveroldali CPU/RAM/DB szűk keresztmetszet elemzés",
                        "Konkrét Redis/Cloudflare/DB optimalizálási terv",
                        "1 db kontroll-teszt a javítások ellenőrzésére"
                    ],
                    duration_label: "Ajánlott: közepes és nagyobb webáruházaknak."
                },
                complex: {
                    name: "Enterprise Scale & Tuning",
                    desc: "15.000+ felhasználó tesztelése + teljes mérnöki gyorsítás.",
                    price: 590000,
                    sub: "egyszeri projekt díj (ÁFA-mentes)",
                    features: [
                        "15 000+ egyidejű felhasználó több régióból",
                        "Teljesítmény-szűk keresztmetszetek közvetlen elhárítása általunk",
                        "Auto-scaling, CDN és cache réteg éles implementációja",
                        "Ismételt terheléspróba 99.9%+ sikeres válasszal",
                        "Élő kampány-ügyelet igény szerint"
                    ],
                    duration_label: "Ajánlott: TV-kampányok, portálok és enterprise platformok."
                }
            },
            how_we_work_title: "Hogyan tesztelünk biztonságosan?",
            how_we_work_desc: "Kontrollált, fokozatos terheléssel — vészleállító kapcsolóval.",
            how_we_work_steps: [
                { title: "Forgatókönyv Tervezés", description: "Kijelöljük a valós felhasználói útvonalakat és a célterhelést." },
                { title: "Szkript & Staging", description: "Elkészítjük a terhelő robotokat éjszakai vagy staging futtatásra." },
                { title: "Fokozatos Terhelés", description: "100 főtől lépcsőzetesen emeljük a nyomást a határpontig." },
                { title: "Diagnosztika & Jelentés", description: "Átadjuk a pontos számokat és végrehajtható gyorsítási tervet." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a terheléstesztekről",
            faq_items: [
                {
                    question: "Leállhat az élő webshopunk a teszt közben?",
                    answer: "Mindig javasoljuk staging környezet vagy hajnali idősáv használatát, és fokozatosan emeljük a terhelést az azonnali leállító gombbal, hogy kárt ne okozzunk."
                },
                {
                    question: "Meg tudjátok mondani, pontosan melyik kódsor vagy bővítmény lassít?",
                    answer: "Igen! A terheléssel párhuzamosan monitorozzuk a szerver CPU/memória/adatbázis lekérdezéseit is, így tűpontosan látszik a szűk keresztmetszet."
                },
                {
                    question: "Segítetek a gyorsítás megvalósításában is?",
                    answer: "Természetesen — nem csak a hibalistát adjuk át, kérésre be is állítjuk a Cloudflare-t, Redisszel és DB indexekkel."
                }
            ],
            cta_title: "Tudd meg, mennyit bír a rendszered"
        },
        en: {
            title: "Campaign Load Testing & Performance Audit",
            description: "Simulate 1,000 to 15,000+ concurrent virtual shoppers via Azure Load Testing before Black Friday, TV spots or product launches — pinpoint bottlenecks and eliminate crashes.",
            keywords: "load testing service, stress test webshop, azure load testing, black friday performance readiness",
            megaTitle: "Load Testing & Stress Audit",
            megaDesc: "Simulate up to 15k users before Black Friday & launches",
            hero_features: [
                "Simulate thousands of concurrent users globally from Azure",
                "Realistic checkout, search & API user flows",
                "Identify CPU, DB connection pool & external API limits",
                "Executive PDF capacity report with concrete bottlenecks",
                "Actionable caching, Redis & DB indexing recommendations",
                "Safe off-peak or staging execution with instant kill-switch"
            ],
            hero_benefits: [
                {
                    title: "Zero Peak-Hour Crashes",
                    description: "Discover database connection limits before the first minute of your biggest sale."
                },
                {
                    title: "Know Your Exact Ceiling",
                    description: "See objectively how many simultaneous buyers your infrastructure sustains cleanly."
                },
                {
                    title: "Verified Speed Gains",
                    description: "Re-test after optimizations to confirm 3–10x higher throughput capacity."
                }
            ],
            use_cases_title: "When Load Testing Is Essential",
            use_cases_desc: "A crashed store wastes paid ad traffic and loses high-intent shoppers forever",
            use_cases_items: [
                {
                    title: "Black Friday & Peak Campaigns",
                    description: "Validate store elasticity for 5x–20x baseline traffic surges.",
                    example: "Replay newsletter blast traffic spikes with 3,000 parallel shoppers.",
                    roi: "Protect peak-season revenue"
                },
                {
                    title: "Pre-Launch Platform Validation",
                    description: "Verify newly engineered SaaS portals & APIs before public release.",
                    example: "Catch N+1 SQL bottlenecks and connection leaks prior to day one.",
                    roi: "Confident production launches"
                },
                {
                    title: "Broadcast / Shark Tank Spikes",
                    description: "Prepare for instant traffic floods triggered by national media spots.",
                    example: "Tune Cloudflare edge caching + stress verify zero 502 errors.",
                    roi: "Convert media visibility into revenue"
                },
                {
                    title: "Ticketing & Booking Drops",
                    description: "Validate race conditions and database locks during synchronized openings.",
                    example: "Verify seat-reservation locks under thousands of simultaneous hits.",
                    roi: "Crash-free high-demand bookings"
                }
            ],
            pricing_title: "Load Testing Packages",
            pricing_desc: "Fixed-scope performance stress tests & tuning. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Stress Check Start",
                    desc: "Targeted stress test up to 1,000 concurrent virtual users.",
                    price: 149000,
                    sub: "one-time fee (VAT-free)",
                    features: [
                        "Up to 1,000 concurrent virtual users from Azure",
                        "Core landing page & critical API stress tests",
                        "Latency, error-rate & throughput telemetry graphs",
                        "Executive PDF bottleneck summary report"
                    ],
                    duration_label: "Best for smaller sites & launch validation."
                },
                detailed: {
                    name: "Campaign Ready Audit",
                    badge: "Most popular",
                    popular: true,
                    desc: "Full buyer journey load test with 5,000 virtual users.",
                    price: 290000,
                    sub: "one-time fee (VAT-free)",
                    features: [
                        "Up to 5,000 concurrent virtual users",
                        "Full add-to-cart, search & checkout API stress script",
                        "Server CPU, memory & DB query bottleneck profiling",
                        "Tailored Redis / CDN / DB optimization roadmap",
                        "1 verification re-test after initial fixes"
                    ],
                    duration_label: "Best for established ecommerce stores & B2B apps."
                },
                complex: {
                    name: "Enterprise Scale & Tuning",
                    desc: "15,000+ user stress tests plus hands-on engineering fixes.",
                    price: 590000,
                    sub: "one-time project fee (VAT-free)",
                    features: [
                        "15,000+ concurrent users across multi-region Azure nodes",
                        "Hands-on remediation of discovered bottlenecks",
                        "Auto-scaling, CDN & Redis caching implementation",
                        "Final verified benchmark proving target capacity",
                        "Optional live campaign standby monitoring"
                    ],
                    duration_label: "Best for TV campaigns & high-volume enterprise stores."
                }
            },
            how_we_work_title: "Controlled Execution",
            how_we_work_desc: "Gradual ramp-up testing with full safety controls.",
            how_we_work_steps: [
                { title: "Scenario Design", description: "Define realistic visitor paths & target peak volume." },
                { title: "Script Authoring", description: "Build parameterized load scripts for staging or off-peak runs." },
                { title: "Ramped Execution", description: "Step up load gradually while watching telemetry." },
                { title: "Bottleneck Report", description: "Deliver clear graphs and an actionable tuning guide." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Answers on performance & load testing",
            faq_items: [
                {
                    question: "Could testing crash our live storefront?",
                    answer: "We run against staging environments or off-peak windows using progressive ramp-ups and instant abort triggers."
                },
                {
                    question: "Will we know which plugin or DB query is slowing us down?",
                    answer: "Yes, we correlate load bursts with backend telemetry to isolate exact slow components."
                },
                {
                    question: "Can BacklineIT also implement the speed optimizations?",
                    answer: "Yes — our Enterprise tier includes full remediation and re-testing."
                }
            ],
            cta_title: "Stress-Test Your Platform"
        }
    },

    // 11. Cloud Virtual Workstations (Azure Virtual Desktop / VDI)
    {
        serviceKey: "VirtualDesktop",
        navKey: "vdi_desktop",
        category: "security_cloud",
        slug: "felhos-virtualis-munkaallomasok-vdi",
        enSlug: "cloud-virtual-workstations-vdi",
        icon: "Monitor",
        sortOrder: 28,
        basePrice: 69000,
        hu: {
            title: "Felhős Virtuális Munkaállomások (VDI)",
            description: "Központilag védett Windows 11 felhő-munkaállomások (Azure Virtual Desktop) távmunkásoknak, könyvelőknek és mérnököknek — céges adat sosem hagyja el a védett adatközpontot.",
            keywords: "azure virtual desktop, vdi munkaállomás, távmunka biztonságos desktop, felhős windows munkaállomás, könyvelői felhő szerver",
            megaTitle: "Felhős Munkaállomások (VDI)",
            megaDesc: "Biztonságos távmunka-környezet az Azure felhőben",
            hero_features: [
                "Teljes értékű Windows 11 munkaállomás böngészőből vagy távoli asztalról",
                "Szigorú adatvédelem: vágólap, USB és helyi letöltés tiltható",
                "Villámgyors hozzáférés az Azure-ban futó ERP/könyvelő programokhoz",
                "Microsoft Entra ID + kötelező kétfaktoros (MFA) védelem",
                "GPU-s opció mérnöki CAD / 3D / videós munkához is",
                "Új távmunkás gépének kiosztása 5 perc alatt postázás nélkül"
            ],
            hero_benefits: [
                {
                    title: "Céges Adat a Felhőben Marad",
                    description: "A dolgozó akár saját laptopjáról vagy tabletjéről is dolgozhat — egyetlen ügyfélfájl sem kerül lementésre az eszközére."
                },
                {
                    title: "Nulla Hardver-logisztika",
                    description: "Új külsős kolléga vagy könyvelő belépésekor nem kell drága laptopot vásárolni és konfigurálni, azonnal kap felhő-asztalt."
                },
                {
                    title: "Gyors ERP & Hálózati Elérés",
                    description: "Minden munkatárs közvetlen gigabites adatközponti sávszélességen éri el a közös adatbázisokat és fájlokat."
                }
            ],
            use_cases_title: "Hol verhetetlen a felhős VDI?",
            use_cases_desc: "Maximális rugalmasság a dolgozóknak, banki szintű kontroll a cégvezetésnek",
            use_cases_items: [
                {
                    title: "Távmunkás Pénzügyi & Könyvelő Csapatok",
                    description: "Érzékeny bér- és számlázási programok (pl. RLB, Kulcs-Soft, SAP) biztonságos futtatása otthonról.",
                    example: "A könyvelő otthonról belép MFA-val, dolgozik a közös adatbázisban, de fájlt nem tud kimenteni a saját gépére.",
                    roi: "Teljes GDPR védelem távmunkában is"
                },
                {
                    title: "Külső Alvállalkozók & Projekt-fejlesztők",
                    description: "Időszakos külső partnerek gyors bekötése és projektzáráskor 1 kattintásos tiltása.",
                    example: "A projekt végén visszavonod a belépést, a forráskód és a rajzok 100%-a nálad marad.",
                    roi: "0 szellemi tulajdon-vesztés"
                },
                {
                    title: "Több Telephelyes Kiskereskedelem / Irodák",
                    description: "Egységes, központilag frissített munkakörnyezet drága lokális szerverek nélkül.",
                    example: "Központi Windows frissítések és automatikus éjszakai mentés minden asztalra.",
                    roi: "Kevesebb rendszergazdai kiszállás"
                },
                {
                    title: "Mérnöki / CAD Tervező Csapatok",
                    description: "Nagy memória- és GPU-igényű programok futtatása vékony kliensekről.",
                    example: "Erőművi Azure GPU munkaállomás, amit csak munkaidőben számláz a rendszer.",
                    roi: "Drága munkaállomás-vásárlások kiváltása"
                }
            ],
            pricing_title: "Felhős Munkaállomás (VDI) Csomagok",
            pricing_desc: "Kezelt Azure Virtual Desktop környezetek bevezetéssel és havi üzemeltetéssel. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "VDI Team (1–5 fő)",
                    desc: "Gyors, biztonságos felhő munkaállomás kis csapatnak.",
                    price: 69000,
                    sub: "bevezetés (+ 24.900 Ft/fő/hó üzemeltetés)",
                    features: [
                        "1–5 felhasználói Windows 11 felhős munkaállomás",
                        "Microsoft Entra ID belépés & kötelező MFA",
                        "Közös céges fájltárhely (FSLogix profilokkal)",
                        "Helyi letöltés és USB átirányítás tiltása opcionálisan",
                        "Napi automatikus mentés és frissítés"
                    ],
                    duration_label: "Ajánlott: könyvelőknek, kisebb irodáknak, ügyvédeknek."
                },
                detailed: {
                    name: "VDI Business (6–25 fő)",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Automatikusan skálázódó host pool & munkaidő-optimalizálás.",
                    price: 149000,
                    sub: "bevezetés (+ 19.900 Ft/fő/hó üzemeltetés)",
                    features: [
                        "6–25 felhasználó támogatása multi-session hostokon",
                        "Munkaidős Auto-Start / Stop (akár 50% Azure költségmegtakarítás)",
                        "Belső ERP / pénzügyi alkalmazások központi telepítése",
                        "DLP szabályok (képernyőkép, vágólap, USB védelem)",
                        "Menedzselt Helpdesk támogatás munkaidőben"
                    ],
                    duration_label: "Ajánlott: növekvő KKV csapatoknak és távmunkás irodáknak."
                },
                complex: {
                    name: "Enterprise & GPU Workstation",
                    desc: "Dedikált CAD/GPU gépek, privát irodai VPN és VDI klaszter.",
                    price: 290000,
                    sub: "bevezetés (egyedi / fő havidíjjal)",
                    features: [
                        "NVIDIA GPU-gyorsított tervezői/mérnöki munkaállomások",
                        "Site-to-Site VPN vagy ExpressRoute meglévő irodához",
                        "Szigorú Conditional Access & Zero-Trust biztonság",
                        "Egyedi automatizált arculati lemezkép-kezelés",
                        "Dedikált cloud rendszermérnök"
                    ],
                    duration_label: "Ajánlott: mérnökirodáknak és nagyvállalati csapatoknak."
                }
            },
            how_we_work_title: "A bevezetés menete",
            how_we_work_desc: "Akár egy hét alatt átköltöztetjük az irodai alkalmazásaitokat a felhőbe.",
            how_we_work_steps: [
                { title: "Alkalmazás Audit", description: "Felmérjük, milyen programok (ERP, Office, CAD) és adatok kellenek." },
                { title: "Arany Lemezkép", description: "Összeállítjuk az előtelepített, optimalizált Windows 11 környezetet." },
                { title: "Entra ID & Biztonság", description: "Bekötjük a kétfaktoros védelmet és az adatvédelmi tilalmakat." },
                { title: "Átadás & Üzemeltetés", description: "Mindenki kap egy belépési linket és azonnal dolgozhat." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a felhős Windows munkaállomásokról",
            faq_items: [
                {
                    question: "Szükséges drága számítógép a dolgozó oldalán a csatlakozáshoz?",
                    answer: "Nem! Bármilyen olcsó laptopról, MacBookról vagy akár böngészőből akadásmentesen futtatható, mert minden számítás az Azure adatközpontban történik."
                },
                {
                    question: "Működik rajta a helyi könyvelő- vagy számlázóprogramunk?",
                    answer: "Igen, teljes értékű Windows 11 környezet fut, így bármilyen meglévő magyar ügyviteli, könyvelő vagy ERP szoftver futtatható benne."
                },
                {
                    question: "Mi van, ha valaki otthonról Macet vagy Linuxot használ?",
                    answer: "A Microsoft Windows App kliensen vagy modern böngészőn keresztül Macről, iPadről, Linuxról és Windowsról is tökéletesen elérhető."
                }
            ],
            cta_title: "Válts biztonságos felhő-irodára"
        },
        en: {
            title: "Cloud Virtual Workstations (Azure VDI)",
            description: "Centrally managed Windows 11 cloud desktops (Azure Virtual Desktop) for remote teams, accountants and contractors — keeping 100% of sensitive data safely inside EU data centers.",
            keywords: "azure virtual desktop vdi, remote cloud workstation, secure byod workspace, virtual windows 11 desktop",
            megaTitle: "Cloud Workstations (VDI)",
            megaDesc: "Secure Windows 11 remote workspaces hosted in Azure",
            hero_features: [
                "Full Windows 11 desktops accessible via browser or client",
                "Strict DLP rules: lock USB ports, clipboard & local downloads",
                "Gigabit data-center speed to cloud ERP & accounting DBs",
                "Microsoft Entra ID + mandatory Multi-Factor Auth (MFA)",
                "Optional NVIDIA GPU nodes for CAD, 3D and video teams",
                "Onboard new contractors in 5 minutes without shipping hardware"
            ],
            hero_benefits: [
                {
                    title: "Data Never Leaves Cloud",
                    description: "Staff can work from personal laptops — zero proprietary customer files touch local drives."
                },
                {
                    title: "Zero Hardware Logistics",
                    description: "Skip buying, shipping, and wiping expensive laptops for external staff or seasonal peaks."
                },
                {
                    title: "Consistent Performance",
                    description: "Central patching, daily backups, and low-latency links to shared business databases."
                }
            ],
            use_cases_title: "Where VDI Shines",
            use_cases_desc: "Total freedom for remote talent, total security control for leadership",
            use_cases_items: [
                {
                    title: "Remote Finance & Accounting",
                    description: "Access sensitive payroll and billing tools cleanly from any location.",
                    example: "Accountants sign in with MFA without exporting raw spreadsheets to home PCs.",
                    roi: "Full GDPR protection across remote teams"
                },
                {
                    title: "External Contractors & Freelancers",
                    description: "Provision secure environments day one and revoke instantly upon exit.",
                    example: "Revoke access at contract end while retaining 100% of source code and drawings.",
                    roi: "Eliminate contractor IP leakage"
                },
                {
                    title: "Multi-Office Standardization",
                    description: "Eliminate fragile office servers across regional branches.",
                    example: "Central OS updates and automated nightly snapshots across all desktops.",
                    roi: "Slashed on-site IT support visits"
                },
                {
                    title: "Engineering & CAD Teams",
                    description: "Run heavy 3D design software seamlessly on thin laptops.",
                    example: "Pay for high-memory GPU instances strictly during active work hours.",
                    roi: "Avoid expensive workstation cap-ex"
                }
            ],
            pricing_title: "Cloud Workstation Packages",
            pricing_desc: "Turnkey Azure Virtual Desktop setup & managed care. Prices exclude VAT.",
            plans: {
                base: {
                    name: "VDI Team (1–5 Users)",
                    desc: "Fast, secure cloud desktops for boutique teams.",
                    price: 69000,
                    sub: "setup (+ 24.9k HUF/user/mo managed)",
                    features: [
                        "1–5 Windows 11 cloud desktop profiles",
                        "Entra ID authentication & enforced MFA",
                        "Shared company file share (FSLogix profiles)",
                        "Optional clipboard, USB & local download locks",
                        "Automated nightly backups & OS updates"
                    ],
                    duration_label: "Best for accounting firms, legal teams & small offices."
                },
                detailed: {
                    name: "VDI Business (6–25 Users)",
                    badge: "Most popular",
                    popular: true,
                    desc: "Autoscaling multi-session host pools with work-hour scheduling.",
                    price: 149000,
                    sub: "setup (+ 19.9k HUF/user/mo managed)",
                    features: [
                        "6–25 staff supported on smart autoscaling pools",
                        "Automated start/stop schedules (up to 50% infra savings)",
                        "Pre-packaged internal ERP & finance software",
                        "Strict DLP policies (no local save / screenshot block)",
                        "Business-hours remote helpdesk support"
                    ],
                    duration_label: "Best for growing SMBs & distributed remote teams."
                },
                complex: {
                    name: "Enterprise & GPU Workstation",
                    desc: "Dedicated NVIDIA GPU stations & Site-to-Site office VPN.",
                    price: 290000,
                    sub: "setup (custom per-seat monthly)",
                    features: [
                        "GPU-accelerated virtual engineering workstations",
                        "Encrypted Site-to-Site VPN back to office LAN",
                        "Conditional Access & Zero-Trust device policies",
                        "Automated golden-image lifecycle pipeline",
                        "Dedicated cloud infrastructure architect"
                    ],
                    duration_label: "Best for engineering firms & enterprise IT."
                }
            },
            how_we_work_title: "Rollout Process",
            how_we_work_desc: "Move your core workspace applications to Azure within one week.",
            how_we_work_steps: [
                { title: "App Assessment", description: "Inventory legacy desktop apps, ERP clients, and file shares." },
                { title: "Golden Image Build", description: "Create a fast, pre-loaded Windows 11 template." },
                { title: "Zero-Trust Policies", description: "Lock down MFA, network boundaries, and DLP rules." },
                { title: "Go-Live", description: "Distribute login URLs and support staff onboarding." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about Azure Virtual Desktop",
            faq_items: [
                {
                    question: "Does staff need powerful laptops on their desk?",
                    answer: "No. Processing runs in Azure, so any basic laptop, Mac, Chromebook or browser works smoothly."
                },
                {
                    question: "Will our legacy desktop accounting software work?",
                    answer: "Yes — it runs native Windows 11, supporting virtually any Windows desktop application."
                },
                {
                    question: "Can Mac or Linux users connect?",
                    answer: "Yes, via the official Windows App client or directly through modern HTML5 browsers."
                }
            ],
            cta_title: "Deploy Secure Cloud Workspaces"
        }
    },

    // 12. White-Label Encrypted Client Portal & File Sharing
    {
        serviceKey: "WhiteLabelPortal",
        navKey: "client_portal_wl",
        category: "infrastructure",
        slug: "white-label-titkositott-ugyfelportal",
        enSlug: "white-label-encrypted-client-portal",
        icon: "FolderLock",
        sortOrder: 29,
        basePrice: 120000,
        hu: {
            title: "White-Label Titkosított Ügyfélportál",
            description: "Saját céges logóval és domainnel (ugyfelkapu.ceged.hu) működő biztonságos ügyfélkapu könyvelőknek, ügyvédeknek és tanácsadóknak — felejtsd el a WeTransfert és a Gmailen elkallódó PDF-eket!",
            keywords: "white label ügyfélportál, biztonságos fájlmegosztó cégeknek, könyvelői ügyfélkapu, titkosított dokumentumtár",
            megaTitle: "White-Label Ügyfélportál",
            megaDesc: "Saját márkás, titkosított dokumentumcsere és ügyfélkapu",
            hero_features: [
                "Saját domain (portal.ceged.hu) és 100%-os céges arculat",
                "Titkosított EU Azure fájltárolás lejárati dátumok és WeTransfer nélkül",
                "Külön mappák ügyfelenként + tömeges számla/szerződés feltöltés",
                "Automatikus e-mail értesítő új dokumentum feltöltésekor",
                "Letöltési napló: pontosan látod, az ügyfél mikor nyitotta meg",
                "Beépített projekt-státusz és kérdés/jegykezelő felület"
            ],
            hero_benefits: [
                {
                    title: "Professzionális Márkaépítés",
                    description: "Az ügyfeleid nem ingyenes fájlküldő linkeket kapnak, hanem egy elegáns, saját névre szóló üzleti portált."
                },
                {
                    title: "Teljes GDPR Megfelelőség",
                    description: "A bizalmas szerződések és bérpapírok nem e-mail szervereken csücsülnek, hanem titkosított EU tárolóban."
                },
                {
                    title: "Visszakövethető Átadás",
                    description: "Minden dokumentum megtekintése és letöltése időbélyeggel naplózva van — nincs több „nem kaptam meg” vita."
                }
            ],
            use_cases_title: "Mely szakmáknak aranybánya?",
            use_cases_desc: "Váltsd ki a kaotikus email-láncokat egy elegáns, kereshető ügyfélkapuval",
            use_cases_items: [
                {
                    title: "Könyvelő & Bérszámfejtő Irodák",
                    description: "Havi bizonylatok, bevallások és bérlisták strukturált bekérése és átadása.",
                    example: "A cégvezető 2 kattintással feltölti a havi számlákat, a könyvelő pedig azonnal látja és jóváhagyja.",
                    roi: "Havi több órás email-keresgélés megszüntetése"
                },
                {
                    title: "Ügyvédi & Adótanácsadó Irodák",
                    description: "Bizalmas szerződések, cégkivonatok és peranyagok védett adattárolása (Data Room).",
                    example: "Ügyfél-specifikus jelszavas vagy kétfaktoros hozzáférés a legérzékenyebb iratokhoz.",
                    roi: "Ügyvédi titoktartás technológiai garantálása"
                },
                {
                    title: "Építész, Tervező & Mérnökirodák",
                    description: "Nagy méretű CAD tervek, látványtervek és költségvetések verziózott megosztása.",
                    example: "Az építtető bármikor eléri a legfrissebb alaprajzot anélkül, hogy lejárna a letöltő link.",
                    roi: "Soha többé téves, régi tervrajzból dolgozó kivitelező"
                },
                {
                    title: "Marketing & IT Ügynökségek",
                    description: "Havi riportok, számlák, grafikai anyagok és projekt mérföldkövek egy helyen.",
                    example: "Az ügyfél belépve azonnal látja a havi eredményeket és a jóváhagyandó feladatokat.",
                    roi: "Prémium ügynökségi megjelenés, kevesebb megbeszélés"
                }
            ],
            pricing_title: "White-Label Ügyfélportál Csomagok",
            pricing_desc: "Kulcsrakész, egyedi domainre kötött céges portálok. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Portal Start",
                    desc: "Saját arculatos dokumentumtár kisebb irodáknak.",
                    price: 120000,
                    sub: "bevezetés (+ 29.000 Ft/hó / 100 GB tárhely)",
                    features: [
                        "Saját aldomain (portal.ceged.hu) + céges logó és színek",
                        "100 GB titkosított EU Azure Blob Storage",
                        "Akár 25 elkülönített ügyfélfiók és jogosultság",
                        "Automatikus értesítők fájlfeltöltéskor",
                        "Letöltési és megtekintési előzmények naplózása"
                    ],
                    duration_label: "Ajánlott: egyéni ügyvédeknek, kisebb könyvelőknek."
                },
                detailed: {
                    name: "Portal Pro Business",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Korlátlan ügyfél, státuszkövetés és hibajegy modul.",
                    price: 190000,
                    sub: "bevezetés (+ 49.000 Ft/hó / 500 GB tárhely)",
                    features: [
                        "Korlátlan ügyfél- és munkatársi fiók",
                        "500 GB titkosított, naponta mentett Azure tárhely",
                        "Beépített projekt státusz + kérdés/válasz üzenőfal",
                        "2FA (kétfaktoros) belépési opció ügyfeleknek",
                        "Egyedi havi emlékeztető pl. „töltsd fel a havi bizonylatokat!”"
                    ],
                    duration_label: "Ajánlott: könyvelőirodáknak, mérnököknek, ügynökségeknek."
                },
                complex: {
                    name: "Enterprise Client Hub",
                    desc: "2 TB tárhely, CRM/Számlázó szinkron és egyedi modulok.",
                    price: 390000,
                    sub: "bevezetés (+ 89.000 Ft/hó / 2 TB tárhely)",
                    features: [
                        "2 TB dedikált, replikált Azure tároló",
                        "Automatikus számla szinkron (Számlázz.hu / Billingo / Stripe)",
                        "CRM webhook összeköttetés (új ügyfél ➔ automata portálfiók)",
                        "Jogi audit napló + egyedi dokumentum-jóváhagyási gomb",
                        "Dedikált fejlesztői támogatás egyedi bővítésekhez"
                    ],
                    duration_label: "Ajánlott: nagyobb tanácsadó és pénzügyi cégeknek."
                }
            },
            how_we_work_title: "Hogyan kapod meg a portálodat?",
            how_we_work_desc: "Pár nap alatt testreszabjuk a céged arculatára és átadjuk a kulcsokat.",
            how_we_work_steps: [
                { title: "Arculat & Domain", description: "Bekötjük a logódat, színeidet és a `portal.ceged.hu` aldomaint." },
                { title: "Mappaszerkezet", description: "Kialakítjuk az alapértelmezett ügyfél-mappákat (pl. Számlák, Szerződések)." },
                { title: "Felhő Telepítés", description: "Élesítjük a titkosított Azure tárhelyet és e-mail értesítéseket." },
                { title: "Ügyfelek Meghívása", description: "Betanítjuk a csapatodat a portál napi 2 perces használatára." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Minden a saját márkás ügyfélportálról",
            faq_items: [
                {
                    question: "Látszik bárhol, hogy a BacklineIT fejlesztette?",
                    answer: "Nem! A felület, a böngészőfül címe és a kiküldött értesítő levelek is a te saját céges neveden és logóddal jelennek meg."
                },
                {
                    question: "Mekkora fájlokat lehet rajta küldeni (pl. CAD vagy videó)?",
                    answer: "Nincs a 25 MB-os e-mail limit: több gigabájtos fájlokat is könnyedén kezel nagy sebességgel."
                },
                {
                    question: "Mennyire biztonságosak az adatok a WeTransferhez képest?",
                    answer: "Minden fájl titkosítva (AES-256) pihen az Európai Unió Azure szerverein, és csak bejelentkezett, jogosult felhasználó töltheti le."
                }
            ],
            cta_title: "Indítsd el a saját ügyfélkapudat"
        },
        en: {
            title: "White-Label Encrypted Client Portal",
            description: "Your own branded client portal (portal.yourcompany.com) for accountants, law firms and agencies — replace expiring WeTransfer links and messy Gmail attachments with encrypted EU cloud storage.",
            keywords: "white label client portal, encrypted file sharing business, gdpr document portal, accounting client portal",
            megaTitle: "White-Label Client Portal",
            megaDesc: "Branded encrypted file room & status hub on your domain",
            hero_features: [
                "Custom domain (portal.yourcompany.com) & 100% your branding",
                "Encrypted EU Azure file storage with zero link expirations",
                "Structured per-client folders & drag-and-drop bulk uploads",
                "Instant email alerts when clients upload or request files",
                "Full audit log tracking exact view & download timestamps",
                "Integrated milestone tracker & client messaging thread"
            ],
            hero_benefits: [
                {
                    title: "Elevated Brand Experience",
                    description: "Greet clients with a sleek custom portal under your brand instead of generic file links."
                },
                {
                    title: "Bulletproof GDPR Storage",
                    description: "Keep sensitive contracts, IDs and payroll inside encrypted EU cloud vaults — never plain email."
                },
                {
                    title: "Zero Lost Attachments",
                    description: "Every uploaded receipt and signed contract stays organized permanently by client and year."
                }
            ],
            use_cases_title: "Who Loves White-Label Portals?",
            use_cases_desc: "Replace fragmented email chains with one secure, organized client workspace",
            use_cases_items: [
                {
                    title: "Accounting & Payroll Practices",
                    description: "Streamline monthly invoice collection and payslip delivery.",
                    example: "Clients drop receipts into designated folders while your team gets instant alerts.",
                    roi: "Eliminate hours of email chasing every month"
                },
                {
                    title: "Law & Tax Advisory Firms",
                    description: "Secure Data Room for M&A, litigation and sensitive agreements.",
                    example: "Audit exactly who downloaded a contract draft down to the second.",
                    roi: "Technological proof of client confidentiality"
                },
                {
                    title: "Architecture & Engineering",
                    description: "Share multi-gigabyte CAD blueprints and revision logs safely.",
                    example: "Contractors always pull the latest approved drawing with zero broken links.",
                    roi: "Eliminate costly outdated-blueprint errors"
                },
                {
                    title: "Agencies & Consultancies",
                    description: "Centralize monthly reports, creative assets and approvals.",
                    example: "Clients review deliverables, approve milestones and grab invoices in one spot.",
                    roi: "Premium agency polish & fewer status calls"
                }
            ],
            pricing_title: "White-Label Portal Packages",
            pricing_desc: "Turnkey portals launched on your custom subdomain. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Portal Start",
                    desc: "Branded encrypted document room for boutique firms.",
                    price: 120000,
                    sub: "setup (+ 29k HUF/mo / 100 GB storage)",
                    features: [
                        "Custom subdomain + your brand colors & logo",
                        "100 GB encrypted EU Azure Blob Storage",
                        "Up to 25 isolated client accounts",
                        "Automated upload & download notifications",
                        "Full download timestamp audit logs"
                    ],
                    duration_label: "Best for solo advisors, boutique lawyers & CPAs."
                },
                detailed: {
                    name: "Portal Pro Business",
                    badge: "Most popular",
                    popular: true,
                    desc: "Unlimited clients, project milestones & two-way messaging.",
                    price: 190000,
                    sub: "setup (+ 49k HUF/mo / 500 GB storage)",
                    features: [
                        "Unlimited client & staff accounts",
                        "500 GB daily-backed-up encrypted EU vault",
                        "Integrated project status & client ticket threads",
                        "Optional 2FA security for external clients",
                        "Automated monthly document request reminders"
                    ],
                    duration_label: "Best for accounting firms, engineers & agencies."
                },
                complex: {
                    name: "Enterprise Client Hub",
                    desc: "2 TB storage, CRM/Billing sync & custom approval workflows.",
                    price: 390000,
                    sub: "setup (+ 89k HUF/mo / 2 TB storage)",
                    features: [
                        "2 TB geo-replicated Azure enterprise vault",
                        "Invoice auto-sync (Stripe / billing APIs)",
                        "CRM webhooks (auto-create portal on new client deal)",
                        "Formal document approval sign-off stamps",
                        "Dedicated developer support for custom modules"
                    ],
                    duration_label: "Best for mid-size consulting & financial groups."
                }
            },
            how_we_work_title: "Launch Timeline",
            how_we_work_desc: "Customized around your brand and ready within days.",
            how_we_work_steps: [
                { title: "Branding & DNS", description: "Apply your logo, palette, and custom subdomain." },
                { title: "Folder Templates", description: "Pre-build standard per-client document structures." },
                { title: "Cloud Deployment", description: "Provision encrypted Azure storage & notifications." },
                { title: "Client Rollout", description: "Train your staff and invite your first clients." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Details about your custom portal",
            faq_items: [
                {
                    question: "Will BacklineIT branding appear anywhere?",
                    answer: "No — domain, portal interface and system emails carry strictly your brand name."
                },
                {
                    question: "Is there an attachment size limit like Gmail?",
                    answer: "No 25 MB limit; easily share multi-gigabyte archives, CAD sets and videos."
                },
                {
                    question: "Where are our files physically stored?",
                    answer: "At rest with AES-256 encryption inside European Union Azure data centers."
                }
            ],
            cta_title: "Launch Your Branded Portal"
        }
    },

    // 13. GDPR-Compliant Cookie-Free Web Analytics SaaS
    {
        serviceKey: "CookielessAnalytics",
        navKey: "gdpr_analytics",
        category: "growth",
        slug: "gdpr-kompatibilis-cookie-mentes-webanalitika",
        enSlug: "gdpr-compliant-cookieless-analytics",
        icon: "BarChart3",
        sortOrder: 30,
        basePrice: 14900,
        hu: {
            title: "GDPR-Kompatibilis, Cookie-Mentes Webanalitika",
            description: "Google Analytics 4 alternatíva EU-s Azure szerveren: pontos látogatottsági és konverziómérés idegesítő süti-felugró ablakok nélkül — 100%-os adatszuverenitással és élő látogatói térképpel.",
            keywords: "gdpr webanalitika, cookie mentes analitika, google analytics alternatíva, eu szerver analitika, konverziómérés sütik nélkül",
            megaTitle: "Cookie-Mentes GDPR Analitika",
            megaDesc: "EU-s GA4 alternatíva süti-banner és adatvesztés nélkül",
            hero_features: [
                "Nulla süti (Cookie-free) — nincs szükség zavaró GDPR süti-bannerre a méréshez",
                "100% EU-s Azure szerver & Redis: adat nem megy az USA-ba",
                "Állandó adblocker-álló mérés (< 2 KB script, villámgyors oldal)",
                "Valós idejű 3D/városi látogatói térkép és aktív munkamenetek",
                "Ajánlatkérési, gombnyomás- és vásárlási konverziók követése",
                "Letisztult magyar nyelvű vezetői dashboard bonyolult GA4 menük nélkül"
            ],
            hero_benefits: [
                {
                    title: "Akár +40% Több Mérhető Adat",
                    description: "A sütibanneren elutasított vagy adblockerezett látogatók helyett végre látod a valódi teljes forgalmadat."
                },
                {
                    title: "Gyorsabb Oldal & Jobb UX",
                    description: "A hatalmas külső tracking scriptek helyett egy pillekönnyű (< 2 KB) saját mérés fut, ami javítja a PageSpeed pontszámot."
                },
                {
                    title: "Átlátható 1-Oldalas Riport",
                    description: "Nem kell Google Analytics tanfolyam hozzá: 3 másodperc alatt látod, melyik hirdetésből jön az ügyfél."
                }
            ],
            use_cases_title: "Mikor érdemes lecserélni vagy kiegészíteni a GA4-et?",
            use_cases_desc: "Tiszta, jogszerű és könnyen érthető számok azoknak, akik döntéseket akarnak hozni",
            use_cases_items: [
                {
                    title: "Süti-Elutasítások Miatt „Vak” Weboldalak",
                    description: "Sok cégnél a látogatók 35–50%-a elutasítja a sütiket, így a GA4 hamis, hiányos számokat mutat.",
                    example: "Személyes adatot és sütit nem tároló mérésünkkel jogszerűen látod a 100%-os látogatószámot.",
                    roi: "Pontos döntéshozatal valós forgalom alapján"
                },
                {
                    title: "Core Web Vitals & SEO Gyorsítás",
                    description: "Nehéz marketing scriptek kiváltása pehelysúlyú saját szerveroldali/edge méréssel.",
                    example: "A mobil PageSpeed pontszám javulása a fő szál tehermentesítésével.",
                    roi: "Jobb Google helyezés és alacsonyabb visszafordulás"
                },
                {
                    title: "Üzleti Konverzió & CTA Követés",
                    description: "Telefonszám-kattintások, űrlapküldések és PDF letöltések automatikus mérése.",
                    example: "Heti egyértelmű e-mail összefoglaló: hány ajánlatkérés jött Google-ből vs. LinkedInről.",
                    roi: "Okosabb marketing költségvetés-elosztás"
                },
                {
                    title: "Adatérzékeny Szektorok (Egészségügy, Pénzügy, Jog)",
                    description: "Ahol szigorú belső szabályzat tiltja az amerikai felhőszolgáltatók nyomkövető sütijeit.",
                    example: "100%-ban az Európai Unióban kezelt, anonimizált agregált mutatók.",
                    roi: "Teljes hatósági és NAIH/GDPR megfelelés"
                }
            ],
            pricing_title: "GDPR Analitika Csomagok",
            pricing_desc: "Havidíjas SaaS csomagok több weboldalhoz is. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Analytics Start",
                    desc: "Tiszta, sütimentes mérés 1 weboldalhoz.",
                    price: 14900,
                    sub: "Ft / hó (max. 50.000 oldalletöltés/hó)",
                    features: [
                        "1 domain teljes körű, cookie-mentes mérése",
                        "Valós idejű látogató-számláló & forrás/UTM elemzés",
                        "Legnépszerűbb oldalak és visszafordulási mutatók",
                        "Napi/heti PDF vagy e-mail összefoglaló riport",
                        "100% EU Azure adatközponti tárolás"
                    ],
                    duration_label: "Ajánlott: céges weboldalaknak, blogoknak, rendelőnek."
                },
                detailed: {
                    name: "Growth Analytics Pro",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Konverziós célok, élő térkép és több domain kezelése.",
                    price: 29900,
                    sub: "Ft / hó (max. 250.000 oldalletöltés/hó)",
                    features: [
                        "Akár 5 weboldal központi kezelése",
                        "Egyedi konverziós események (CTA, telefon, űrlap, kosár)",
                        "Élő városi szintű látogatói térkép (Cloudflare Geo)",
                        "Saját aldomain (stats.ceged.hu) az adblocker védelemhez",
                        "Korlátlan csapattagi megtekintői hozzáférés"
                    ],
                    duration_label: "Ajánlott: aktív B2B cégeknek és növekvő webshopoknak."
                },
                complex: {
                    name: "Agency / Enterprise Suite",
                    desc: "Korlátlan weboldalak, nagy forgalom és egyedi riporting.",
                    price: 69000,
                    sub: "Ft / hó (1.000.000+ oldalletöltés/hó)",
                    features: [
                        "Korlátlan ügyfél-weboldal egyetlen ügynökségi fiókban",
                        "White-label ügyfél-dashboardok és havi automata PDF riport",
                        "Nyers adat export API (Power BI / Looker Studio felé)",
                        "Szerveroldali konverzió-követés támogatása",
                        "Dedikált fejlesztői segítség az események bekötéséhez"
                    ],
                    duration_label: "Ajánlott: marketing ügynökségeknek és nagy portáloknak."
                }
            },
            how_we_work_title: "5 perces beüzemelés",
            how_we_work_desc: "Egyetlen apró script beillesztésével azonnal indul az adatgyűjtés.",
            how_we_work_steps: [
                { title: "Fiók & Domain", description: "Felveszünk a rendszerbe és opcionálisan beállítjuk a saját mérő-aldomaint." },
                { title: "Szkript Bekötés", description: "Beillesztjük a < 2 KB kódot GTM-be vagy a weboldal fejlécébe." },
                { title: "Célok Beállítása", description: "Bekötjük az ajánlatkérő gombokat és kulcs konverziókat." },
                { title: "Élő Mérés", description: "Azonnal láthatóak a valós látogatók süti-figyelmeztetés nélkül." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "GDPR jogszerűség és technikai működés",
            faq_items: [
                {
                    question: "Tényleg nem kell süti-banner (Cookie Banner) ehhez a méréshez?",
                    answer: "Ha a weboldaladon csak ez az analitika fut és nincs más marketing/remarketing pixel, a rendszerünk semmilyen sütit nem tesz a látogató böngészőjébe és nem tárol személyazonosításra alkalmas adatot — így a GDPR szerint sem szükséges hozzájárulási ablak a látogatottsági méréshez."
                },
                {
                    question: "Futtatható a Google Analytics 4 mellett párhuzamosan is?",
                    answer: "Igen! Sok partnerünk meghagyja a GA4-et a Google Ads miatt, miközben a mi felületünkön ellenőrzi a valódi, adblockerektől nem csonkított látogatószámot."
                },
                {
                    question: "Lassítja az oldalt a mérőkód?",
                    answer: "A szkript mérete kevesebb mint 2 KB és aszinkron töltődik be, gyakorlatilag mérhetetlen (0 ms blokkoló) hatása van."
                }
            ],
            cta_title: "Válts tiszta, EU-s analitikára"
        },
        en: {
            title: "GDPR-Compliant Cookieless Web Analytics",
            description: "Privacy-first Google Analytics 4 alternative hosted in EU Azure centers: accurate traffic & conversion insights without annoying cookie banners or US data transfers.",
            keywords: "gdpr cookieless analytics, google analytics 4 alternative eu, privacy web analytics saas, real time traffic tracker",
            megaTitle: "Cookieless GDPR Analytics",
            megaDesc: "EU GA4 alternative without cookie banners or data loss",
            hero_features: [
                "100% cookie-free — requires zero intrusive consent popups for traffic stats",
                "Strict EU Azure hosting — zero personal data sent overseas",
                "Ultra-light (< 2 KB) script resilient to ad-blockers via proxy",
                "Real-time city map & live active browser session dashboard",
                "Track conversions, button clicks, downloads & UTM sources cleanly",
                "Clean single-screen executive dashboard without GA4 clutter"
            ],
            hero_benefits: [
                {
                    title: "Recover +40% Lost Data",
                    description: "Measure true site volume instead of missing half your visitors who reject cookies."
                },
                {
                    title: "Boost PageSpeed Scores",
                    description: "Replace bloated tracking bundles with a sub-2KB privacy-first edge beacon."
                },
                {
                    title: "Instant Clarity",
                    description: "Understand which channels convert in 5 seconds without taking an analytics course."
                }
            ],
            use_cases_title: "Why Switch or Pair With Cookieless Analytics",
            use_cases_desc: "Clean, lawful, accurate numbers designed for fast business decisions",
            use_cases_items: [
                {
                    title: "Sites Blinded by Cookie Rejections",
                    description: "When 40% of visitors decline tracking banners, standard tools lose half your funnel.",
                    example: "Lawfully capture 100% of anonymized visit & source metrics.",
                    roi: "Accurate attribution for marketing budgets"
                },
                {
                    title: "Core Web Vitals Speedup",
                    description: "Eliminate heavy client scripts throttling mobile SEO scores.",
                    example: "Noticeable LCP & TBT lift on mobile product landing pages.",
                    roi: "Improved SEO rankings & lower bounce"
                },
                {
                    title: "Lead & Conversion Tracking",
                    description: "Measure form submissions, phone taps and PDF downloads natively.",
                    example: "Weekly crisp digest contrasting Google Search vs LinkedIn ROI.",
                    roi: "Smarter channel allocation"
                },
                {
                    title: "Regulated & Privacy-Strict Firms",
                    description: "Healthcare, finance and legal sites banning third-party tracking pixels.",
                    example: "Zero PII retention inside EU-hosted PostgreSQL/Redis nodes.",
                    roi: "Effortless GDPR compliance"
                }
            ],
            pricing_title: "GDPR Analytics Packages",
            pricing_desc: "Simple monthly SaaS pricing per site volume. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Analytics Start",
                    desc: "Clean cookieless traffic tracking for 1 website.",
                    price: 14900,
                    sub: "HUF / mo (up to 50k pageviews/mo)",
                    features: [
                        "1 primary domain fully tracked without cookies",
                        "Real-time visitor counter & UTM source attribution",
                        "Top pages, bounce rates & device splits",
                        "Weekly automated summary email / PDF report",
                        "100% EU Azure server storage"
                    ],
                    duration_label: "Best for corporate websites, clinics & blogs."
                },
                detailed: {
                    name: "Growth Analytics Pro",
                    badge: "Most popular",
                    popular: true,
                    desc: "Conversion goals, live geo map & multi-site dashboard.",
                    price: 29900,
                    sub: "HUF / mo (up to 250k pageviews/mo)",
                    features: [
                        "Up to 5 domains managed centrally",
                        "Custom conversion goals (forms, CTAs, cart steps)",
                        "Real-time city geo map (Cloudflare headers)",
                        "First-party proxy subdomain (stats.yourdomain.com)",
                        "Unlimited team member access"
                    ],
                    duration_label: "Best for B2B service firms & active webshops."
                },
                complex: {
                    name: "Agency / Enterprise Suite",
                    desc: "Unlimited client sites, white-label reports & raw API.",
                    price: 69000,
                    sub: "HUF / mo (1M+ pageviews/mo)",
                    features: [
                        "Unlimited client websites in one agency workspace",
                        "White-label client portals & monthly automated PDFs",
                        "Raw metrics API export (Power BI / Looker)",
                        "Server-side conversion event ingestion",
                        "Dedicated setup assistance"
                    ],
                    duration_label: "Best for digital agencies & high-volume publishers."
                }
            },
            how_we_work_title: "5-Minute Setup",
            how_we_work_desc: "Drop in a tiny async tag and start seeing live data right away.",
            how_we_work_steps: [
                { title: "Workspace Provision", description: "Create your account and first-party stats subdomain." },
                { title: "Script Placement", description: "Add our <2KB tag via site header or GTM." },
                { title: "Goal Mapping", description: "Configure lead forms, downloads, and key CTAs." },
                { title: "Live Metrics", description: "Watch accurate traffic stream in cookie-free." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Privacy compliance & technical specifics",
            faq_items: [
                {
                    question: "Does it truly require no cookie consent banner?",
                    answer: "Yes — when no marketing cookies are placed, strictly anonymized cookieless stats do not store personal data under GDPR."
                },
                {
                    question: "Can we keep GA4 running alongside it?",
                    answer: "Absolutely. Many firms run both side by side to benchmark true un-blocked traffic volume."
                },
                {
                    question: "Will it impact website performance?",
                    answer: "At under 2 KB loaded asynchronously, it has virtually zero main-thread impact."
                }
            ],
            cta_title: "Switch to Clean EU Analytics"
        }
    },

    // 14. Company Registry, Tax ID & NAV Data Enrichment API
    {
        serviceKey: "TaxIdValidationAPI",
        navKey: "tax_api",
        category: "infrastructure",
        slug: "magyar-adoszam-ceginformacio-validalo-api",
        enSlug: "company-tax-id-validation-api",
        icon: "Building2",
        sortOrder: 31,
        basePrice: 89000,
        hu: {
            title: "Magyar Adószám & Céginformáció Validáló API",
            description: "B2B webshop pénztárba és CRM-be köthető gyorsítótárazott mikroszolgáltatás: az adószám beírásával automatikusan kitölti a pontos cégnevet, székhelyet és figyeli a felszámolási/NAV kockázatokat.",
            keywords: "adószám lekérdezés api, céginformáció automata kitöltés webshop, nav adószám ellenőrző, b2b pénztár bővítmény",
            megaTitle: "Adószám & Céginformáció API",
            megaDesc: "Automatikus cégadat-kitöltés webshopokba és CRM-be",
            hero_features: [
                "Adószám beírására azonnali hivatalos cégnév és székhely kitöltés",
                "EU-s közösségi adószám (VIES) érvényességi ellenőrzés",
                "Felszámolás, csőd és kényszertörlés figyelmeztetés CRM-be",
                "Villámgyors Azure Redis gyorsítótár (< 30 ms válaszidő)",
                "Kész WooCommerce / Shopify pénztár modul + tiszta REST API",
                "Hibás számlázási adatok és sztornó-számlák 95%-os visszaszorítása"
            ],
            hero_benefits: [
                {
                    title: "Kevesebb Sztornó Számla",
                    description: "A vevők nem írják el többé a saját Kft.-jük nevét vagy címét — a pénztárod mindig a NAV/cégjegyzék szerinti adatot használja."
                },
                {
                    title: "Gyorsabb B2B Vásárlás",
                    description: "Egy 8-11 jegyű adószám megadásával 4–5 mező magától kitöltődik, ami érezhetően javítja a B2B pénztár konverziót."
                },
                {
                    title: "Hitelkockázati Védelem",
                    description: "Átutalásos vevőknél előre jelez a rendszer, ha a partner ellen kényszertörlés vagy végrehajtás indult."
                }
            ],
            use_cases_title: "Hol térül meg az első hónapban?",
            use_cases_desc: "Tiszta partner-adatbázis manuális keresgélés nélkül",
            use_cases_items: [
                {
                    title: "B2B Webshop Pénztár Gyorsítás",
                    description: "Céges vásárlók azonnali kiszolgálása elgépelésmentes számlázási adatokkal.",
                    example: "A vevő beüti az adószámot -> azonnal kitöltődik az irányítószám, város, utca, cégnév.",
                    roi: "Magasabb pénztár-befejezési arány"
                },
                {
                    title: "CRM Partner-adatbázis Tisztítás",
                    description: "Meglévő több ezer ügyfél adószámának és székhelyének éjszakai automatikus frissítése.",
                    example: "Jelzi az ügyfélkezelőnek, ha egy régi VIP partner székhelyet váltott vagy adószámát felfüggesztették.",
                    roi: "Mindig naprakész CRM és pontos szerződések"
                },
                {
                    title: "Átutalásos / Halasztott Fizetés Kockázatszűrése",
                    description: "Automatikus vörös zászló, mielőtt több milliós árut adnál ki utalásos fizetéssel.",
                    example: "A rendelés jóváhagyásánál piros jelzés figyelmeztet a partner negatív cégkockázatára.",
                    roi: "Behajthatatlan kintlévőségek megelőzése"
                },
                {
                    title: "Ügyfélregisztrációs Űrlapok Dúsítása",
                    description: "Ajánlatkérők és partnerek cégméretének és fő tevékenységi körének (TEÁOR) lekérése.",
                    example: "Az értékesítő az első hívás előtt látja a leendő ügyfél árbevételi sávját és cégadatát.",
                    roi: "Felkészültebb B2B értékesítési hívások"
                }
            ],
            pricing_title: "Adószám & Cégadat API Csomagok",
            pricing_desc: "Gyorsítótárazott mikroszolgáltatás webshopokba és vállalati rendszerekbe. Az árak ÁFA-mentesek.",
            plans: {
                base: {
                    name: "Checkout Autocomplete",
                    desc: "Webshop pénztár adószám-kitöltő bővítmény + API.",
                    price: 89000,
                    sub: "bevezetés (+ 14.900 Ft/hó / 2.000 lekérdezés)",
                    features: [
                        "WooCommerce / egyedi weboldal pénztár integráció",
                        "Hivatalos cégnév, adószám, EU VAT és székhely kitöltés",
                        "Azure Redis villám-gyorsítótárazás",
                        "Havi max. 2 000 valós idejű lekérdezés",
                        "Automatikus számlázó-kompatibilis adatformátum"
                    ],
                    duration_label: "Ajánlott: B2B megrendeléseket fogadó webshopoknak."
                },
                detailed: {
                    name: "CRM & Risk Shield",
                    badge: "Legnépszerűbb",
                    popular: true,
                    desc: "Webshop + CRM szinkron és felszámolási kockázatjelző.",
                    price: 169000,
                    sub: "bevezetés (+ 29.900 Ft/hó / 10.000 lekérdezés)",
                    features: [
                        "Magyar adószám + EU VIES valós idejű ellenőrzés",
                        "Felszámolás, csőd és kényszertörlés státusz riasztás",
                        "MiniCRM / HubSpot / egyedi ERP webhook integráció",
                        "TEÁOR, főtevékenység és cégméret dúsítás",
                        "Havi 10 000 gyorsítótárazott lekérdezés"
                    ],
                    duration_label: "Ajánlott: B2B kereskedőknek és nagykereskedéseknek."
                },
                complex: {
                    name: "Enterprise Data Cleanse",
                    desc: "Korlátlan ERP szinkron & havi teljes partnerállomány-audit.",
                    price: 340000,
                    sub: "bevezetés (+ 59.000 Ft/hó nagy volumenhez)",
                    features: [
                        "Korlátlan belső API lekérdezés dedikált Azure csomóponton",
                        "Teljes meglévő ERP/SAP partner-törzs éjszakai tisztítása",
                        "Egyedi hitelkeret-jóváhagyási szabályrendszer",
                        "99.95% API rendelkezésreállási garancia",
                        "Dedikált fejlesztői támogatás"
                    ],
                    duration_label: "Ajánlott: nagykereskedelmi és pénzügyi vállalatoknak."
                }
            },
            how_we_work_title: "Hogyan kötjük be?",
            how_we_work_desc: "Akár 1–2 nap alatt beépítjük a webshopod vagy CRM rendszered pénztárába.",
            how_we_work_steps: [
                { title: "API Kulcs & Teszt", description: "Biztosítjuk a dedikált végpontot és dokumentációt." },
                { title: "Pénztár / CRM Bekötés", description: "Telepítjük a bővítményt vagy bekötjük az űrlap mezőkhöz." },
                { title: "Validációs Szabályok", description: "Beállítjuk a magyar és EU adószám-formátum ellenőrzéseket." },
                { title: "Éles Használat", description: "Az ügyfelek 2 másodperc alatt hibátlanul kitöltik az adataikat." }
            ],
            faq_title: "Gyakori Kérdések",
            faq_desc: "Tudnivalók a cégadat-validáló API-ról",
            faq_items: [
                {
                    question: "Működik az EU-s közösségi adószámok (VIES) ellenőrzése is?",
                    answer: "Igen! Magyar adószám mellett automatikusan ellenőrzi az EU-s ÁFA számok érvényességét is határon átnyúló számlázáshoz."
                },
                {
                    question: "Lelassítja a pénztár oldalt a külső lekérdezés?",
                    answer: "Nem: a gyakori adatok az Azure Managed Redis gyorsítótárunkból érkeznek < 30 milliszekundum alatt, így észrevehetetlenül gyors."
                },
                {
                    question: "Meg tudja tisztítani a már meglévő, hibás CRM partnerlistánkat is?",
                    answer: "Igen, az Enterprise csomaggal a meglévő ügyféltábládat is végigfutjuk és javítjuk az elavult címeket, adószámokat."
                }
            ],
            cta_title: "Automatizáld a cégadat-kitöltést"
        },
        en: {
            title: "Company Tax ID & Registry Validation API",
            description: "High-speed cached microservice for B2B webshops & CRMs: typing a VAT/Tax ID auto-fills legal company name and billing address while flagging insolvency risks instantly.",
            keywords: "tax id autocomplete api, vies vat validation microservice, b2b checkout company lookup, crm data enrichment",
            megaTitle: "Tax ID & Registry Data API",
            megaDesc: "Instant checkout company autocomplete & risk checks",
            hero_features: [
                "Auto-fills official company name & street from VAT/Tax ID",
                "Real-time EU VIES VAT validity checks for B2B invoicing",
                "Instant liquidation, bankruptcy & suspension risk alerts",
                "Sub-30ms response speed backed by Azure Managed Redis",
                "Plug-and-play WooCommerce / Shopify modules & REST API",
                "Cut invoicing typos & credit notes by up to 95%"
            ],
            hero_benefits: [
                {
                    title: "Zero Billing Typos",
                    description: "Stop customers from mis-typing legal suffixes or postal codes before automated invoices generate."
                },
                {
                    title: "Higher B2B Checkout Conversion",
                    description: "Typing a single tax number fills 5 form fields automatically, saving buyers friction."
                },
                {
                    title: "Credit Risk Protection",
                    description: "Catch distressed or liquidated buyers before approving net-30 wire terms."
                }
            ],
            use_cases_title: "Immediate ROI Use Cases",
            use_cases_desc: "Clean master vendor & customer records without manual registry lookups",
            use_cases_items: [
                {
                    title: "Fast B2B Storefront Checkouts",
                    description: "Delight business shoppers with instant error-free billing auto-fill.",
                    example: "Shopper types tax ID -> official entity name & HQ address populate instantly.",
                    roi: "Higher checkout completion & zero invoice re-issues"
                },
                {
                    title: "Automated CRM Enrichment",
                    description: "Keep thousands of client records synced with address & legal status changes.",
                    example: "Alerts account managers if an active client switches HQ or enters insolvency.",
                    roi: "Always accurate contracts & billing records"
                },
                {
                    title: "Net-Terms Fraud Filtering",
                    description: "Verify buyer solvency automatically prior to shipping deferred orders.",
                    example: "Checkout API flags negative status before warehouse fulfillment begins.",
                    roi: "Prevent bad debt & uncollectible receivables"
                },
                {
                    title: "Lead Form Intelligence",
                    description: "Enrich inbound B2B leads with revenue tier & industry sector codes.",
                    example: "Sales reps enter discovery calls knowing company size and entity details.",
                    roi: "Sharper B2B sales qualification"
                }
            ],
            pricing_title: "Tax ID & Enrichment API Packages",
            pricing_desc: "Fast cached API bundles for shops and CRMs. Prices exclude VAT.",
            plans: {
                base: {
                    name: "Checkout Autocomplete",
                    desc: "Shop checkout tax lookup plugin & REST endpoint.",
                    price: 89000,
                    sub: "setup (+ 14.9k HUF/mo / 2k calls)",
                    features: [
                        "WooCommerce or custom checkout form integration",
                        "Instant legal name, address & EU VAT validation",
                        "Azure Managed Redis edge caching",
                        "Up to 2,000 monthly lookups included",
                        "Invoice-ready clean formatting"
                    ],
                    duration_label: "Best for ecommerce stores selling to B2B clients."
                },
                detailed: {
                    name: "CRM & Risk Shield",
                    badge: "Most popular",
                    popular: true,
                    desc: "Full B2B validation, VIES check & liquidation risk alerts.",
                    price: 169000,
                    sub: "setup (+ 29.9k HUF/mo / 10k calls)",
                    features: [
                        "National registry + live EU VIES validation",
                        "Insolvency, suspension & liquidation status flags",
                        "HubSpot / MiniCRM / custom ERP webhook integration",
                        "Industry classification & company size enrichment",
                        "10,000 cached monthly API lookups"
                    ],
                    duration_label: "Best for wholesale distributors & B2B operators."
                },
                complex: {
                    name: "Enterprise Data Cleanse",
                    desc: "High-volume ERP syncing & nightly master-table hygiene.",
                    price: 340000,
                    sub: "setup (+ 59k HUF/mo enterprise scale)",
                    features: [
                        "Unlimited internal API volume on dedicated node",
                        "Automated nightly cleanup of existing ERP partner tables",
                        "Custom credit-approval risk scoring rules",
                        "99.95% endpoint uptime SLA",
                        "Dedicated integration support"
                    ],
                    duration_label: "Best for enterprise finance & wholesale networks."
                }
            },
            how_we_work_title: "Integration Steps",
            how_we_work_desc: "Installed into your checkout or CRM within 1–2 days.",
            how_we_work_steps: [
                { title: "API Provision", description: "Issue isolated keys and endpoint documentation." },
                { title: "Form / CRM Hook", description: "Connect lookup triggers cleanly to your form fields." },
                { title: "Cache & Rules", description: "Configure national & EU VIES validation policies." },
                { title: "Go-Live", description: "Customers auto-complete company details in 2 seconds." }
            ],
            faq_title: "Frequently Asked Questions",
            faq_desc: "Technical specifics of company validation",
            faq_items: [
                {
                    question: "Does it support EU cross-border VAT (VIES) verification?",
                    answer: "Yes, it automatically verifies cross-border EU VAT numbers alongside domestic registries."
                },
                {
                    question: "Does lookup latency slow down our checkout page?",
                    answer: "No — cached lookups serve straight from Azure Redis in under 30 milliseconds."
                },
                {
                    question: "Can you clean our existing messy CRM contact database?",
                    answer: "Yes, our Enterprise tier runs batch validation to update legacy client addresses and tax IDs."
                }
            ],
            cta_title: "Automate Company Data Entry"
        }
    }
]
