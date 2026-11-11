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
    Radar,
    MailCheck,
    Shield,
    Bot,
    FileText,
    Mic,
    Gauge,
    Monitor,
    FolderLock,
    BarChart3,
    Building2,
    LucideIcon
} from "lucide-react"

export interface ServiceItem {
    key: string;
    href: string;
    icon: LucideIcon;
    popular?: boolean;
    isNew?: boolean;
}

export interface ServiceCategory {
    id: "growth" | "security_cloud" | "core" | "infrastructure";
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
            { key: "enterprise_rag", href: "/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag", icon: Bot, popular: true, isNew: true },
            { key: "doc_ocr", href: "/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr", icon: FileText, isNew: true },
            { key: "voice_ai", href: "/szolgaltatasok/ai-hivas-es-targyalaselemzo-asszisztens", icon: Mic, isNew: true },
            { key: "tender_monitor", href: "/szolgaltatasok/automatizalt-palyazat-es-kozbeszerzes-figyelo", icon: Search, isNew: true },
            { key: "ai_auto", href: "/szolgaltatasok/ai-asszisztensek", icon: Cpu },
            { key: "crm_auto", href: "/szolgaltatasok/crm-lead-automatizacio", icon: Puzzle, popular: true },
            { key: "gdpr_analytics", href: "/szolgaltatasok/gdpr-kompatibilis-cookie-mentes-webanalitika", icon: BarChart3, isNew: true },
        ]
    },
    {
        id: "security_cloud",
        icon: ShieldCheck,
        nameKey: "categories.security_cloud",
        descKey: "categories.security_cloud_desc",
        items: [
            { key: "sec_monitoring", href: "/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2", icon: Radar, popular: true, isNew: true },
            { key: "phishing_sim", href: "/szolgaltatasok/adathalaszat-szimulacio-biztonsagi-oktatas", icon: MailCheck, isNew: true },
            { key: "managed_waf", href: "/szolgaltatasok/menedzselt-enterprise-waf-vedelem", icon: Shield, isNew: true },
            { key: "draas", href: "/szolgaltatasok/zsarolovirus-vedett-katasztrofa-helyreallitas-draas", icon: Database, popular: true, isNew: true },
            { key: "synthetic_mon", href: "/szolgaltatasok/szintetikus-webshop-es-fizetes-monitoring", icon: Activity, isNew: true },
            { key: "load_testing", href: "/szolgaltatasok/kampany-elotti-terhelesteszteles-load-testing", icon: Gauge, isNew: true },
            { key: "vdi_desktop", href: "/szolgaltatasok/felhos-virtualis-munkaallomasok-vdi", icon: Monitor, isNew: true },
        ]
    },
    {
        id: "core",
        icon: Server,
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
            { key: "webshop_auto", href: "/szolgaltatasok/webshop-automatizacio", icon: Zap },
            { key: "ecommerce_tracking", href: "/szolgaltatasok/webshop-meres-konverzio-noveles", icon: Activity },
            { key: "dashboards", href: "/szolgaltatasok/uzleti-dashboardok-riportok", icon: Layout, popular: true },
            { key: "client_portal_wl", href: "/szolgaltatasok/white-label-titkositott-ugyfelportal", icon: FolderLock, isNew: true },
            { key: "tax_api", href: "/szolgaltatasok/magyar-adoszam-ceginformacio-validalo-api", icon: Building2, isNew: true },
            { key: "scripts", href: "/szolgaltatasok/scriptek", icon: Terminal },
            { key: "sysadmin", href: "/szolgaltatasok/rendszeruzemeltetes", icon: Server },
            { key: "network", href: "/szolgaltatasok/halozat", icon: Network },
            { key: "integrations", href: "/szolgaltatasok/integraciok", icon: Puzzle }
        ]
    }
];
