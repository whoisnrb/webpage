import * as fs from "fs"
import * as path from "path"
import { PrismaClient } from "@prisma/client"
import { NEW_AZURE_SERVICES, type AzureServiceDefinition, type AzureServiceLocaleContent } from "../prisma/azure-services-data"
import { NEW_AZURE_SERVICES_PART2 } from "../prisma/azure-services-data-part2"
import { redisDelPattern } from "../src/lib/redis"

const ALL_NEW_SERVICES: AzureServiceDefinition[] = [
    ...NEW_AZURE_SERVICES,
    ...NEW_AZURE_SERVICES_PART2,
]

function buildI18nServiceSection(c: AzureServiceLocaleContent) {
    const mapPlan = (p: AzureServiceLocaleContent["plans"]["base"], isPopular = false) => ({
        name: p.name,
        desc: p.desc,
        price: String(p.price),
        priceFrom: "true",
        sub: p.sub,
        ...(isPopular && p.badge ? { badge: p.badge, popular: true } : {}),
        features: p.features,
        duration_label: p.duration_label,
    })

    return {
        title: c.title,
        description: c.description,
        keywords: c.keywords,
        hero_features: c.hero_features,
        hero_benefits: c.hero_benefits,
        use_cases_title: c.use_cases_title,
        use_cases_desc: c.use_cases_desc,
        use_cases_items: c.use_cases_items,
        pricing_title: c.pricing_title,
        pricing_desc: c.pricing_desc,
        plans: {
            base: mapPlan(c.plans.base, false),
            detailed: mapPlan(c.plans.detailed, true),
            complex: mapPlan(c.plans.complex, false),
        },
        how_we_work_title: c.how_we_work_title,
        how_we_work_desc: c.how_we_work_desc,
        how_we_work_steps: c.how_we_work_steps,
        faq_title: c.faq_title,
        faq_desc: c.faq_desc,
        faq_items: c.faq_items,
        cta_title: c.cta_title,
    }
}

function syncMessagesFiles() {
    const huPath = path.join(process.cwd(), "messages", "hu.json")
    const enPath = path.join(process.cwd(), "messages", "en.json")

    const hu = JSON.parse(fs.readFileSync(huPath, "utf8"))
    const en = JSON.parse(fs.readFileSync(enPath, "utf8"))

    // 1. Add security_cloud MegaMenu category
    hu.MegaMenu.categories.security_cloud = "Kibervédelem & Felhő Biztonság"
    hu.MegaMenu.categories.security_cloud_desc = "0–24 NIS2 monitoring, WAF pajzs, DRaaS, phishing teszt és felhős VDI."

    en.MegaMenu.categories.security_cloud = "Cybersecurity & Cloud Resilience"
    en.MegaMenu.categories.security_cloud_desc = "24/7 NIS2 monitoring, WAF shield, DRaaS, phishing drills & VDI."

    // 2. Add nav_items + full Services namespace per service
    for (const svc of ALL_NEW_SERVICES) {
        hu.MegaMenu.nav_items[svc.navKey] = svc.hu.megaTitle
        hu.MegaMenu.nav_items[`${svc.navKey}_desc`] = svc.hu.megaDesc

        en.MegaMenu.nav_items[svc.navKey] = svc.en.megaTitle
        en.MegaMenu.nav_items[`${svc.navKey}_desc`] = svc.en.megaDesc

        hu.Services[svc.serviceKey] = buildI18nServiceSection(svc.hu)
        en.Services[svc.serviceKey] = buildI18nServiceSection(svc.en)
    }

    fs.writeFileSync(huPath, JSON.stringify(hu, null, 2) + "\n", "utf8")
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n", "utf8")
    console.log("Updated messages/hu.json and messages/en.json with 14 new services.")
}

function generateRoutePages() {
    const baseDir = path.join(process.cwd(), "src", "app", "[locale]", "szolgaltatasok")

    for (const svc of ALL_NEW_SERVICES) {
        const routeDir = path.join(baseDir, svc.slug)
        fs.mkdirSync(routeDir, { recursive: true })

        const routePath = `/szolgaltatasok/${svc.slug}`
        const componentName = `${svc.serviceKey}Page`
        const content = `import { Metadata } from "next"
import { routing } from "@/i18n/routing"
import { buildServiceMetadata, renderServiceDetailPage } from "@/lib/service-page-helper"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    return buildServiceMetadata(locale, "${svc.serviceKey}", "${routePath}")
}

export default async function ${componentName}({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    return renderServiceDetailPage(locale, "${svc.slug}", "${svc.serviceKey}")
}
`
        fs.writeFileSync(path.join(routeDir, "page.tsx"), content, "utf8")
        console.log(`  ✓ Route created: src/app/[locale]/szolgaltatasok/${svc.slug}/page.tsx`)
    }
}

async function seedDatabaseAndClearRedis() {
    const prisma = new PrismaClient()
    try {
        for (const svc of ALL_NEW_SERVICES) {
            const packages = (["base", "detailed", "complex"] as const).map((tier) => {
                const huPlan = svc.hu.plans[tier]
                const enPlan = svc.en.plans[tier]
                return {
                    name: huPlan.name,
                    nameEn: enPlan.name,
                    desc: huPlan.desc,
                    descEn: enPlan.desc,
                    price: huPlan.price,
                    sub: huPlan.sub,
                    subEn: enPlan.sub,
                    badge: huPlan.badge || "",
                    badgeEn: enPlan.badge || "",
                    popular: Boolean(huPlan.popular),
                    features: huPlan.features,
                    featuresEn: enPlan.features,
                    duration_label: huPlan.duration_label,
                    duration_labelEn: enPlan.duration_label,
                }
            })

            const record = {
                name: svc.hu.title,
                nameEn: svc.en.title,
                slug: svc.slug,
                description: svc.hu.description,
                descriptionEn: svc.en.description,
                price: svc.basePrice,
                icon: svc.icon,
                href: `/szolgaltatasok/${svc.slug}`,
                features: JSON.stringify(svc.hu.hero_features.slice(0, 4)),
                featuresEn: JSON.stringify(svc.en.hero_features.slice(0, 4)),
                packages: JSON.stringify(packages),
                active: true,
                sortOrder: svc.sortOrder,
            }

            await prisma.service.upsert({
                where: { slug: svc.slug },
                update: record,
                create: record,
            })
            console.log(`  ✓ Seeded DB service: ${svc.hu.title} (${svc.slug})`)
        }
    } finally {
        await prisma.$disconnect()
    }

    const cleared = await redisDelPattern("services:*")
    console.log("Redis services:* cache invalidated:", cleared)
}

async function main() {
    syncMessagesFiles()
    generateRoutePages()
    await seedDatabaseAndClearRedis()
    console.log("All 14 new Azure-powered services fully synchronized!")
    process.exit(0)
}

main().catch((err) => {
    console.error("Sync failed:", err)
    process.exit(1)
})
