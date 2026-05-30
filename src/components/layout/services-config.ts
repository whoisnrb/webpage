import { 
    Cloud, 
    Cpu, 
    Puzzle, 
    Activity, 
    Layout, 
    Headphones, 
    RefreshCw, 
    Zap, 
    Search, 
    Database, 
    Globe, 
    Terminal, 
    Server, 
    Network,
    Sparkles,
    ShieldCheck,
    Code2,
    LucideIcon
} from "lucide-react"

export interface ServiceItem {
    key: string;
    href: string;
    icon: LucideIcon;
    popular?: boolean;
}

export interface ServiceCategory {
    id: "growth" | "core" | "infrastructure";
    icon: LucideIcon;
    nameKey: string;
    descKey: string;
    items: ServiceItem[];
}

export const SERVICES_STRUCTURE: ServiceCategory[] = [
    {
        id: "growth",
        icon: Sparkles,
        nameKey: "categories.growth",
        descKey: "categories.growth_desc",
        items: [
            { key: "ai_support", href: "/szolgaltatasok/ai-ugyfelszolgalat-weboldalra", icon: Cpu, popular: true },
            { key: "ai_auto", href: "/szolgaltatasok/ai-asszisztensek", icon: Cpu },
            { key: "crm_auto", href: "/szolgaltatasok/crm-lead-automatizacio", icon: Puzzle, popular: true },
            { key: "ecommerce_tracking", href: "/szolgaltatasok/webshop-meres-konverzio-noveles", icon: Activity },
            { key: "dashboards", href: "/szolgaltatasok/uzleti-dashboardok-riportok", icon: Layout, popular: true },
            { key: "webshop_auto", href: "/szolgaltatasok/webshop-automatizacio", icon: Zap }
        ]
    },
    {
        id: "core",
        icon: ShieldCheck,
        nameKey: "categories.core",
        descKey: "categories.core_desc",
        items: [
            { key: "managed_it", href: "/szolgaltatasok/havidijas-rendszergazda", icon: Activity, popular: true },
            { key: "remote_helpdesk", href: "/szolgaltatasok/remote-it-helpdesk-ticketing", icon: Headphones, popular: true },
            { key: "office_suite", href: "/szolgaltatasok/microsoft-365-google-workspace", icon: Cloud },
            { key: "cloud_migration", href: "/szolgaltatasok/felho-migracio-koltsegoptimalizalas", icon: Cloud, popular: true },
            { key: "it_audit", href: "/szolgaltatasok/kkv-it-audit", icon: Search },
            { key: "backup", href: "/szolgaltatasok/backup-adatmentes", icon: Database }
        ]
    },
    {
        id: "infrastructure",
        icon: Code2,
        nameKey: "categories.infrastructure",
        descKey: "categories.infrastructure_desc",
        items: [
            { key: "webdev", href: "/szolgaltatasok/webfejlesztes", icon: Globe },
            { key: "wordpress", href: "/szolgaltatasok/wordpress-woocommerce-karbantartas", icon: RefreshCw },
            { key: "scripts", href: "/szolgaltatasok/scriptek", icon: Terminal },
            { key: "sysadmin", href: "/szolgaltatasok/rendszeruzemeltetes", icon: Server },
            { key: "network", href: "/szolgaltatasok/halozat", icon: Network },
            { key: "integrations", href: "/szolgaltatasok/integraciok", icon: Puzzle }
        ]
    }
];
