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

export const landingPages: Record<string, LandingPageConfig> = {};
