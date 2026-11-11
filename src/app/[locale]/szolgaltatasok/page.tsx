import { Suspense } from "react"
import { ArrowRight, CheckCircle2, Code2, Server, Shield } from "lucide-react"
import { Link, routing } from "@/i18n/routing"
import { getLocale, getTranslations } from "next-intl/server"
import { getSeoMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"
import { getActiveServices } from "@/app/actions/service"
import { SERVICES_STRUCTURE } from "@/components/layout/services-config"
import { ServicesHero } from "@/components/sections/services-hero"
import { ServicesCatalog } from "@/components/services/services-catalog"
import {
    FALLBACK_BASE_SERVICES,
    FALLBACK_EXTRA_PRICES,
    getServiceMetaByHref,
    inferPricingKind,
    type CatalogServiceItem,
    type ServiceCategoryId,
} from "@/components/services/service-catalog-helpers"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "ServicesPage" })

    return {
        title: t("hero_badge"),
        description: t("hero_desc"),
        keywords: [
            "IT szolgáltatások",
            "webfejlesztés",
            "rendszerüzemeltetés",
            "kiberbiztonság",
            "egyedi szoftver",
            "backlineit",
        ],
        ...getSeoMetadata(locale, "/szolgaltatasok"),
        openGraph: {
            title: `${t("hero_badge")} | BacklineIT`,
            description: t("hero_desc"),
        },
    }
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function SzolgaltatasokPage() {
    const t = await getTranslations("ServicesPage")
    const tMega = await getTranslations("MegaMenu")
    const tStats = await getTranslations("Stats")
    const locale = await getLocale()
    const isHu = locale === "hu"

    const dbServices = await getActiveServices()

    let services: CatalogServiceItem[] = dbServices.map((service) => {
        const title = locale === "en" ? service.nameEn || service.name : service.name
        const description =
            locale === "en" ? service.descriptionEn || service.description : service.description
        const featuresRaw = locale === "en" ? service.featuresEn || service.features : service.features
        const features = Array.isArray(featuresRaw) ? featuresRaw : []
        const meta = getServiceMetaByHref(service.href)

        return {
            id: service.id,
            slug: service.slug,
            href: service.href,
            title,
            description,
            iconName: service.icon || "Code2",
            pricing: service.price,
            pricingKind: inferPricingKind(service.price, service.slug, service.packages),
            packageCount: Array.isArray(service.packages) ? service.packages.length : 0,
            features,
            categoryId: meta.categoryId,
            isNew: meta.isNew,
            popular: meta.popular,
            orderIndex: meta.orderIndex,
        }
    })

    if (services.length === 0) {
        const seenHrefs = new Set<string>()
        const baseFallback: CatalogServiceItem[] = FALLBACK_BASE_SERVICES.map((spec) => {
            seenHrefs.add(spec.href)
            const meta = getServiceMetaByHref(spec.href)
            const slug = spec.href.split("/").pop() || spec.tKey
            return {
                id: `fallback-${spec.tKey}`,
                slug,
                href: spec.href,
                title: t(`items.${spec.tKey}.title`),
                description: t(`items.${spec.tKey}.desc`),
                iconName: spec.iconName,
                pricing: spec.pricing,
                pricingKind: inferPricingKind(spec.pricing, slug),
                packageCount: 0,
                features: [
                    t(`items.${spec.tKey}.features.0`),
                    t(`items.${spec.tKey}.features.1`),
                    t(`items.${spec.tKey}.features.2`),
                    t(`items.${spec.tKey}.features.3`),
                ],
                categoryId: meta.categoryId,
                isNew: meta.isNew,
                popular: meta.popular,
                orderIndex: meta.orderIndex,
            }
        })

        const extraFallback: CatalogServiceItem[] = SERVICES_STRUCTURE.flatMap((cat) =>
            cat.items
                .filter((item) => !seenHrefs.has(item.href))
                .map((item) => {
                    const extra = FALLBACK_EXTRA_PRICES[item.href]
                    const meta = getServiceMetaByHref(item.href)
                    const slug = item.href.split("/").pop() || item.key
                    return {
                        id: `fallback-${item.key}`,
                        slug,
                        href: item.href,
                        title: tMega(`nav_items.${item.key}`),
                        description: tMega(`nav_items.${item.key}_desc`),
                        iconName: extra?.iconName || "Code2",
                        pricing: extra?.pricing ?? 0,
                        pricingKind: extra?.pricingKind ?? "custom",
                        packageCount: extra?.packageCount ?? 0,
                        features: [],
                        categoryId: meta.categoryId,
                        isNew: meta.isNew,
                        popular: meta.popular,
                        orderIndex: meta.orderIndex,
                    }
                })
        )

        services = [...baseFallback, ...extraFallback]
    }

    services.sort((a, b) => a.orderIndex - b.orderIndex)

    const categoryCounts: Record<ServiceCategoryId, number> = {
        growth: 0,
        security_cloud: 0,
        core: 0,
        infrastructure: 0,
    }
    for (const svc of services) {
        categoryCounts[svc.categoryId] = (categoryCounts[svc.categoryId] ?? 0) + 1
    }

    const entryPaths = [
        {
            code: "01 · AUDIT",
            title: isHu ? "IT & Biztonsági Átvilágítás" : "IT & Security Audit",
            desc: isHu
                ? "Teljes hálózati, szerver- és jogosultsági diagnosztika 1–2 héten belül, prioritizált javítási tervvel."
                : "Full infrastructure, server, and access audit delivered in 1–2 weeks with an actionable remediation roadmap.",
            href: "/szolgaltatasok/kkv-it-audit" as const,
            cta: isHu ? "Audit részletek" : "Explore Audit",
        },
        {
            code: "02 · AI & AUTOMATION",
            title: isHu ? "Privát AI & Automatizáció" : "Private AI & Automation",
            desc: isHu
                ? "Belső tudásbázis, dokumentumfeldolgozás vagy CRM munkafolyamatok bevezetése 2–4 hetes PoC sprintben."
                : "Private enterprise RAG knowledge base, document OCR, or CRM workflow automation shipped in a 2–4 week sprint.",
            href: "/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag" as const,
            cta: isHu ? "AI megoldások" : "Explore AI",
        },
        {
            code: "03 · SLA & SECURITY",
            title: isHu ? "Folyamatos Védelem & Managed IT" : "24/7 Protection & Managed IT",
            desc: isHu
                ? "0–24 NIS2 felügyelet, WAF, katasztrófa-helyreállítás és kiszámítható havidíjas rendszergazdai háttér."
                : "Continuous NIS2 monitoring, WAF shielding, disaster recovery, and predictable monthly engineering support.",
            href: "/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2" as const,
            cta: isHu ? "Monitoring csomagok" : "View Monitoring",
        },
    ]

    const deliverySteps = isHu
        ? [
              {
                  step: "01",
                  title: "Műszaki felmérés & igénytisztázás",
                  desc: "30 perces mérnöki konzultáción átnézzük a jelenlegi rendszereket és szűk keresztmetszeteket.",
              },
              {
                  step: "02",
                  title: "Architektúra terv & fix tételes ajánlat",
                  desc: "Átlátható műszaki specifikáció, költségbecslés (Azure/üzemeltetés külön bontva) és határidők.",
              },
              {
                  step: "03",
                  title: "Implementáció & terheléses ellenőrzés",
                  desc: "Staging környezetben tesztelt bevezetés, automatizált mentéssel és biztonsági kontrollokkal.",
              },
              {
                  step: "04",
                  title: "Dokumentált átadás & opcionális SLA",
                  desc: "Teljes kód- és hozzáférés-tulajdonjog, csapatbetanítás és választható folyamatos felügyelet.",
              },
          ]
        : [
              {
                  step: "01",
                  title: "Technical Discovery & Scoping",
                  desc: "In a 30-minute engineering review, we map your current stack, bottlenecks, and compliance needs.",
              },
              {
                  step: "02",
                  title: "Architecture Blueprint & Fixed Proposal",
                  desc: "Clear technical specification, transparent pricing (cloud ops vs. delivery separated), and milestones.",
              },
              {
                  step: "03",
                  title: "Staging Delivery & Verification",
                  desc: "Hardened implementation tested in staging with automated backups and security guardrails.",
              },
              {
                  step: "04",
                  title: "Documented Handover & Optional SLA",
                  desc: "Full repository and infrastructure ownership, team onboarding, and optional 24/7 managed ops.",
              },
          ]

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: isHu ? "Kezdőlap" : "Home", href: isHu ? "/" : "/en" },
                    {
                        name: isHu ? "Szolgáltatások" : "Services",
                        href: isHu ? "/szolgaltatasok" : "/en/services",
                    },
                ]}
            />

            {/* Editorial Enterprise Header */}
            <ServicesHero
                badge={t("hero_badge")}
                title={t("hero_title")}
                titleHighlight={t("hero_title_highlight")}
                description={t("hero_desc")}
                ctaQuote={t("cta_quote")}
                totalCount={services.length}
                categoryCounts={categoryCounts}
            />

            {/* Interactive 4-Pillar Bento Catalog with Sticky Toolbar */}
            <Suspense
                fallback={
                    <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-72 rounded-2xl border border-white/[0.06] bg-[#070c18] animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                }
            >
                <ServicesCatalog services={services} />
            </Suspense>

            {/* Recommended Entry Points */}
            <section className="border-t border-white/[0.06] bg-[#040812]/70 py-14 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                {isHu ? "BELÉPÉSI PONTOK" : "STARTING POINTS"}
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                                {isHu
                                    ? "Nem tudod, melyik szolgáltatással érdemes kezdeni?"
                                    : "Not sure where to start?"}
                            </h2>
                        </div>
                        <p className="max-w-md text-sm text-slate-400">
                            {isHu
                                ? "Három bevált induló konstrukció meglévő vállalati infrastruktúrához."
                                : "Three proven entry engagements tailored to existing company stacks."}
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {entryPaths.map((path) => (
                            <Link
                                key={path.code}
                                href={path.href}
                                className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#070c18] p-6 transition-colors hover:border-cyan-500/40 hover:bg-[#091020]"
                            >
                                <div>
                                    <span className="mb-3 block font-mono text-[11px] font-semibold tracking-[0.16em] text-cyan-400">
                                        {path.code}
                                    </span>
                                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
                                        {path.title}
                                    </h3>
                                    <p className="mb-6 text-sm leading-relaxed text-slate-400">
                                        {path.desc}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 border-t border-white/[0.06] pt-4 text-xs font-semibold text-cyan-400">
                                    <span>{path.cta}</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Engineering Commitments & 4-Step Delivery Process */}
            <section className="border-t border-white/[0.06] py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid items-start gap-12 lg:grid-cols-12">
                        {/* Left: Engineering Principles */}
                        <div className="lg:col-span-6">
                            <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                {isHu ? "MÉRNÖKI ALAPELVEK" : "ENGINEERING STANDARDS"}
                            </span>
                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                                {t("why_us_title")}
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-slate-400">
                                {t("why_us_lead")}
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-[#070c18] p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-cyan-400">
                                        <Code2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-base font-bold text-white">
                                            {t("reasons.tech.title")}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {t("reasons.tech.desc")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-[#070c18] p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-cyan-400">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-base font-bold text-white">
                                            {t("reasons.security.title")}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {t("reasons.security.desc")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-[#070c18] p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-cyan-400">
                                        <Server className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-base font-bold text-white">
                                            {t("reasons.scale.title")}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {t("reasons.scale.desc")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: 4-Step Delivery Workflow */}
                        <div className="lg:col-span-6">
                            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070c18]">
                                <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0a101f] px-6 py-4">
                                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                                        {isHu ? "Együttműködési folyamat" : "Delivery Workflow"}
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-500">
                                        01 → 04
                                    </span>
                                </div>

                                <div className="divide-y divide-white/[0.06]">
                                    {deliverySteps.map((item) => (
                                        <div key={item.step} className="flex gap-4 px-6 py-5">
                                            <span className="mt-0.5 font-mono text-xs font-semibold text-cyan-400">
                                                {item.step}
                                            </span>
                                            <div>
                                                <h3 className="mb-1 text-sm font-bold text-white sm:text-base">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-slate-400">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clean Architectural Closing CTA */}
            <section className="pb-20 pt-4">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#070d1b] p-8 md:p-12">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="max-w-2xl">
                                <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                    {isHu ? "KÖVETKEZŐ LÉPÉS" : "NEXT STEP"}
                                </span>
                                <h2 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-4xl">
                                    {t("cta_bottom_title")}
                                </h2>
                                <p className="text-base leading-relaxed text-slate-400">
                                    {t("cta_bottom_desc")}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Link
                                    href="/demo"
                                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-500 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
                                >
                                    <span>{t("cta_consultation")}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/arak"
                                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                                >
                                    <span>{t("cta_packages")}</span>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-6 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                                <span>{tStats("ssl_security")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                                <span>{tStats("gdpr_compliant")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                                <span>{tStats("no_hidden_costs")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
