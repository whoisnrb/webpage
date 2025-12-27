export interface IndustryData {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage: string; // CSS class for placeholder or path
    problems: { title: string; description: string }[];
    solutions: { title: string; description: string }[];
    relatedServices: string[]; // helper to match services
}

export const industries: IndustryData[] = [
    {
        slug: "ecommerce",
        title: "E-kereskedelem",
        subtitle: "Növeld webshopod forgalmát intelligens megoldásokkal",
        description: "Az e-kereskedelemben a sebesség és a felhasználói élmény a kulcs. Segítünk modernizálni webshopodat, hogy több látogatóból legyen vásárló.",
        heroImage: "bg-gradient-to-r from-green-500/20 to-emerald-700/20",
        problems: [
            { title: "Lassú betöltés", description: "A látogatók 53%-a elhagyja az oldalt, ha 3 másodpercnél tovább tölt." },
            { title: "Bonyolult adminisztráció", description: "Túl sok idő megy el a rendelések és készletek kézi kezelésével." },
            { title: "Alacsony konverzió", description: "Sokan teszik kosárba a terméket, de kevesen vásárolják meg." }
        ],
        solutions: [
            { title: "Next.js Frontend", description: "Villámgyors, modern frontend, ami azonnal betölt és jobb SEO-t biztosít." },
            { title: "Automatizált Folyamatok", description: "Összekötjük webshopodat a számlázóval és futárszolgálattal." },
            { title: "UX/UI Optimalizálás", description: "Adatvezérelt tervezéssel javítjuk a vásárlási élményt." }
        ],
        relatedServices: ["Webdevelopment", "Automation", "Consulting"]
    },
    {
        slug: "saas",
        title: "SaaS & Startupok",
        subtitle: "Skálázható technológia a gyors növekedéshez",
        description: "Egy startupnál a gyors piacra lépés és a skálázhatóság a legfontosabb. Mi biztosítjuk a technikai hátteret az ötletedhez.",
        heroImage: "bg-gradient-to-r from-blue-500/20 to-indigo-700/20",
        problems: [
            { title: "Technikai adósság", description: "A gyors indulás miatt később nehézkes a fejlesztés." },
            { title: "Skálázódási problémák", description: "A rendszer nem bírja a hirtelen megnövekedett felhasználószámot." },
            { title: "Biztonsági kockázatok", description: "Az adatok védelme kritikus, de gyakran háttérbe szorul." }
        ],
        solutions: [
            { title: "Moduláris Architektúra", description: "Könnyen bővíthető és karbantartható kódbázis." },
            { title: "Cloud-Native Megoldások", description: "Automatikusan skálázódó infrastruktúra (AWS, Vercel)." },
            { title: "Enterprise Security", description: "Beépített védelem és megfelelőség a kezdetektől." }
        ],
        relatedServices: ["Webdevelopment", "Cloud", "Security"]
    },
    {
        slug: "healthcare",
        title: "Egészségügy",
        subtitle: "Biztonságos digitális megoldások praxisoknak",
        description: "Az egészségügyben a bizalom és az adatvédelem a legfontosabb. Modernizáljuk a betegellátást szigorú biztonsági előírások mellett.",
        heroImage: "bg-gradient-to-r from-cyan-500/20 to-blue-700/20",
        problems: [
            { title: "Elavult rendszerek", description: "Nehézkes, papíralapú vagy régi szoftverek használata." },
            { title: "Adatvédelmi aggályok", description: "A GDPR és egyéb eü-szabályozásoknak való megfelelés terhe." },
            { title: "Nehézkes kapcsolattartás", description: "A páciensek nehezen érik el a rendelőt, sokat kell telefonálni." }
        ],
        solutions: [
            { title: "Biztonságos Páciens Portál", description: "Titkosított felület leleteknek és időpontfoglalásnak." },
            { title: "GDPR Compliance", description: "Teljes körű megfelelőség és auditálható rendszerek." },
            { title: "Telemedicina Integráció", description: "Online konzultációs lehetőségek beépítése." }
        ],
        relatedServices: ["Webdevelopment", "Security", "Automation"]
    }
];
