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

export const industries: IndustryData[] = [];
