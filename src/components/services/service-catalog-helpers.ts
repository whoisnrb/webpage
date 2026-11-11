import { SERVICES_STRUCTURE, type ServiceCategory } from "@/components/layout/services-config"
import type { ServicePackage } from "@/app/actions/service"

export type ServiceCategoryId = ServiceCategory["id"]
export type PricingKind = "monthly" | "setup_monthly" | "one_time" | "custom"

export interface CatalogServiceItem {
    id: string
    slug: string
    href: string
    title: string
    description: string
    iconName: string
    pricing: number
    pricingKind: PricingKind
    packageCount: number
    features: string[]
    categoryId: ServiceCategoryId
    isNew: boolean
    popular: boolean
    orderIndex: number
}

interface ServiceMeta {
    categoryId: ServiceCategoryId
    key: string
    isNew: boolean
    popular: boolean
    orderIndex: number
}

const MONTHLY_BASE_SLUGS = new Set([
    "wordpress-woocommerce-karbantartas",
    "backup-adatmentes",
    "havidijas-rendszergazda",
    "remote-it-helpdesk-ticketing",
])

const SERVICE_META_MAP: Record<string, ServiceMeta> = (() => {
    const map: Record<string, ServiceMeta> = {}
    let idx = 0
    for (const category of SERVICES_STRUCTURE) {
        for (const item of category.items) {
            map[item.href] = {
                categoryId: category.id,
                key: item.key,
                isNew: Boolean(item.isNew),
                popular: Boolean(item.popular),
                orderIndex: idx++,
            }
        }
    }
    // DB service not listed directly in MegaMenu nav but active in database
    map["/szolgaltatasok/biztonsag"] = {
        categoryId: "security_cloud",
        key: "security",
        isNew: false,
        popular: false,
        orderIndex: idx++,
    }
    return map
})()

export function getServiceMetaByHref(href: string): ServiceMeta {
    const normalized = href.startsWith("/") ? href : `/szolgaltatasok/${href}`
    return (
        SERVICE_META_MAP[normalized] ?? {
            categoryId: "infrastructure",
            key: normalized.split("/").pop() || "custom",
            isNew: false,
            popular: false,
            orderIndex: 999,
        }
    )
}

export function inferPricingKind(
    price: number,
    slug: string,
    packages?: ServicePackage[] | null
): PricingKind {
    if (!price || price <= 0) return "custom"

    const firstSub = packages?.[0]?.subEn || packages?.[0]?.sub
    if (firstSub) {
        if (/^\s*\+/i.test(firstSub) || /(bevezet|setup)/i.test(firstSub)) {
            return "setup_monthly"
        }
        if (/(\/\s*h[oó]|\/\s*mo\b|\/\s*month)/i.test(firstSub)) {
            return "monthly"
        }
        return "one_time"
    }

    if (MONTHLY_BASE_SLUGS.has(slug)) return "monthly"
    return "one_time"
}

export const FALLBACK_BASE_SERVICES: Array<{
    tKey: string
    href: string
    iconName: string
    pricing: number
}> = [
    { tKey: "scripts", href: "/szolgaltatasok/scriptek", iconName: "Code2", pricing: 50000 },
    { tKey: "webdev", href: "/szolgaltatasok/webfejlesztes", iconName: "ShoppingCart", pricing: 150000 },
    { tKey: "devops", href: "/szolgaltatasok/rendszeruzemeltetes", iconName: "Server", pricing: 0 },
    { tKey: "security", href: "/szolgaltatasok/biztonsag", iconName: "Shield", pricing: 80000 },
    { tKey: "network", href: "/szolgaltatasok/halozat", iconName: "Network", pricing: 0 },
    { tKey: "wordpress", href: "/szolgaltatasok/wordpress-woocommerce-karbantartas", iconName: "RefreshCw", pricing: 15000 },
    { tKey: "it_audit", href: "/szolgaltatasok/kkv-it-audit", iconName: "Search", pricing: 75000 },
    { tKey: "webshop_auto", href: "/szolgaltatasok/webshop-automatizacio", iconName: "Zap", pricing: 120000 },
    { tKey: "ai_auto", href: "/szolgaltatasok/ai-asszisztensek", iconName: "Cpu", pricing: 150000 },
    { tKey: "office_suite", href: "/szolgaltatasok/microsoft-365-google-workspace", iconName: "Cloud", pricing: 85000 },
    { tKey: "backup", href: "/szolgaltatasok/backup-adatmentes", iconName: "Database", pricing: 10000 },
    { tKey: "managed_it", href: "/szolgaltatasok/havidijas-rendszergazda", iconName: "Activity", pricing: 39000 },
    { tKey: "cloud_migration", href: "/szolgaltatasok/felho-migracio-koltsegoptimalizalas", iconName: "Cloud", pricing: 190000 },
    { tKey: "ai_support", href: "/szolgaltatasok/ai-ugyfelszolgalat-weboldalra", iconName: "Cpu", pricing: 390000 },
    { tKey: "crm_auto", href: "/szolgaltatasok/crm-lead-automatizacio", iconName: "Puzzle", pricing: 290000 },
    { tKey: "ecommerce_tracking", href: "/szolgaltatasok/webshop-meres-konverzio-noveles", iconName: "Activity", pricing: 180000 },
    { tKey: "dashboards", href: "/szolgaltatasok/uzleti-dashboardok-riportok", iconName: "Layout", pricing: 240000 },
    { tKey: "remote_helpdesk", href: "/szolgaltatasok/remote-it-helpdesk-ticketing", iconName: "Headphones", pricing: 69000 },
]

export const FALLBACK_EXTRA_PRICES: Record<
    string,
    { pricing: number; pricingKind: PricingKind; iconName: string; packageCount: number }
> = {
    "/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2": { pricing: 29000, pricingKind: "monthly", iconName: "Radar", packageCount: 3 },
    "/szolgaltatasok/adathalaszat-szimulacio-biztonsagi-oktatas": { pricing: 45000, pricingKind: "one_time", iconName: "MailCheck", packageCount: 3 },
    "/szolgaltatasok/menedzselt-enterprise-waf-vedelem": { pricing: 39000, pricingKind: "monthly", iconName: "Shield", packageCount: 3 },
    "/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag": { pricing: 290000, pricingKind: "setup_monthly", iconName: "Bot", packageCount: 3 },
    "/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr": { pricing: 190000, pricingKind: "setup_monthly", iconName: "FileText", packageCount: 3 },
    "/szolgaltatasok/ai-hivas-es-targyalaselemzo-asszisztens": { pricing: 240000, pricingKind: "setup_monthly", iconName: "Mic", packageCount: 3 },
    "/szolgaltatasok/automatizalt-palyazat-es-kozbeszerzes-figyelo": { pricing: 29000, pricingKind: "monthly", iconName: "Search", packageCount: 3 },
    "/szolgaltatasok/zsarolovirus-vedett-katasztrofa-helyreallitas-draas": { pricing: 49000, pricingKind: "monthly", iconName: "Database", packageCount: 3 },
    "/szolgaltatasok/szintetikus-webshop-es-fizetes-monitoring": { pricing: 19900, pricingKind: "monthly", iconName: "Activity", packageCount: 3 },
    "/szolgaltatasok/kampany-elotti-terhelesteszteles-load-testing": { pricing: 149000, pricingKind: "one_time", iconName: "Gauge", packageCount: 3 },
    "/szolgaltatasok/felhos-virtualis-munkaallomasok-vdi": { pricing: 69000, pricingKind: "setup_monthly", iconName: "Monitor", packageCount: 3 },
    "/szolgaltatasok/white-label-titkositott-ugyfelportal": { pricing: 120000, pricingKind: "setup_monthly", iconName: "FolderLock", packageCount: 3 },
    "/szolgaltatasok/gdpr-kompatibilis-cookie-mentes-webanalitika": { pricing: 14900, pricingKind: "monthly", iconName: "BarChart3", packageCount: 3 },
    "/szolgaltatasok/magyar-adoszam-ceginformacio-validalo-api": { pricing: 89000, pricingKind: "setup_monthly", iconName: "Building2", packageCount: 3 },
    "/szolgaltatasok/integraciok": { pricing: 0, pricingKind: "custom", iconName: "Puzzle", packageCount: 0 },
}
