export type LandingPageConfig = {
    slug: string;
    title: string;
    hero: {
        headline: string;
        subheadline: string;
        cta: string;
        videoUrl?: string; // Optional YouTube ID or video URL
    };
    problem: {
        title: string;
        description: string;
        points: string[];
    };
    solution: {
        title: string;
        description: string;
        features: { title: string; desc: string }[];
    };
    pricing: {
        price: string;
        discountedPrice?: string;
        savings?: string;
    };
};

export const landingPages: Record<string, LandingPageConfig> = {
    "automation-starter": {
        slug: "automation-starter",
        title: "Automation Starter Pack",
        hero: {
            headline: "Kezd el az automatizálást még ma!",
            subheadline: "10 azonnal használható script, ami órákat spórol neked hetente.",
            cta: "Kérem a csomagot",
            videoUrl: "" // TODO: Add sales video
        },
        problem: {
            title: "Eleged van az ismétlődő feladatokból?",
            description: "A legtöbb vállalkozó heti 10-15 órát tölt adminisztrációval, amit egy gép is elvégezhetne.",
            points: [
                "Számlák manuális rendezése",
                "Email címek másolása Excelbe",
                "Vevőknek válaszolgatás ugyanazokra a kérdésekre"
            ]
        },
        solution: {
            title: "Itt a megoldás: Starter Pack",
            description: "Egy minden-egyben csomag, amit 10 perc alatt beüzemelhetsz.",
            features: [
                { title: "Email Rendszerező", desc: "Automatikusan mappákba rendezi a bejövő leveleket." },
                { title: "Számlaolvasó", desc: "Kigyűjti a PDF számlák adatait egy Excelbe." },
                { title: "Lead Generáló Bot", desc: "Scriptek, amik segítenek új ügyfeleket találni." }
            ]
        },
        pricing: {
            price: "49.990 Ft",
            discountedPrice: "19.990 Ft",
            savings: "60% KEDVEZMÉNY"
        }
    }
};
