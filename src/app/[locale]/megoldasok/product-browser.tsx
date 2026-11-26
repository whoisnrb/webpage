"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/ecommerce/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import { LocalizedProductDTO } from "@/app/actions/product"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { Search, X } from "lucide-react"

interface ProductBrowserProps {
    initialProducts: LocalizedProductDTO[]
}

const parseCategoryParam = (param: string | null): string => {
    if (!param) return "all"
    const p = param.toLowerCase().trim()
    if (p === "wordpress" || p === "plugins" || p === "wordpress plugin") return "WordPress Plugin"
    if (p === "automation" || p === "automatizacio" || p === "automatizáció") return "Automatizáció"
    if (p === "script" || p === "scripts") return "Script"
    if (p === "template" || p === "templates") return "Template"
    if (p === "ebook" || p === "ebooks" || p === "e-book") return "E-book"
    return "all"
}

export function ProductBrowser({ initialProducts }: ProductBrowserProps) {
    const t = useTranslations("Products")
    const locale = useLocale()
    const isEn = locale === "en"
    const searchParams = useSearchParams()
    const [activeCategory, setActiveCategory] = useState<string>(() =>
        parseCategoryParam(searchParams.get("category"))
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [quickViewData, setQuickViewData] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const resultsTopRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const param = searchParams.get("category")
        setActiveCategory(parseCategoryParam(param))
    }, [searchParams])

    const handleCategoryClick = (catId: string) => {
        setActiveCategory(catId)
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href)
            if (catId === "all") {
                url.searchParams.delete("category")
            } else {
                const paramMap: Record<string, string> = {
                    "WordPress Plugin": "wordpress",
                    "Automatizáció": "automation",
                    "Script": "script",
                    "Template": "template",
                    "E-book": "ebook"
                }
                url.searchParams.set("category", paramMap[catId] || catId.toLowerCase())
            }
            window.history.replaceState(null, "", url.toString())
        }
        resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const categories = [
        { id: "all", label: t("categories.all") },
        { id: "WordPress Plugin", label: t("categories.wordpress") },
        { id: "Automatizáció", label: t("categories.automation") },
        { id: "Script", label: t("categories.script") },
        { id: "Template", label: t("categories.template") },
        { id: "E-book", label: t("categories.ebook") }
    ]

    const localizedProducts = useMemo(() => {
        return initialProducts.map((product) => {
            const titleKey = `${product.slug}.title`
            const descKey = `${product.slug}.description`
            return {
                ...product,
                localizedTitle: t.has(titleKey) ? t(titleKey) : product.title,
                localizedDesc: t.has(descKey) ? t(descKey) : product.description,
            }
        })
    }, [initialProducts, t])

    const filteredProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        return localizedProducts.filter((p) => {
            const matchesCategory = activeCategory === "all" || p.category === activeCategory
            if (!matchesCategory) return false
            if (!q) return true
            return (
                p.localizedTitle.toLowerCase().includes(q) ||
                p.localizedDesc.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            )
        })
    }, [localizedProducts, activeCategory, searchQuery])

    return (
        <>
            {/* Sticky Filter & Search Bar */}
            <section className="sticky top-16 z-40 py-3 bg-[#030712]/85 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-3">
                    <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-full">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
                                        isActive ? "text-slate-950 font-bold" : "text-white/65 hover:text-white"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Search Input & Result Count */}
                    <div className="flex items-center gap-3 w-full sm:w-auto lg:w-72">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isEn ? "Search solutions..." : "Keresés a megoldások között..."}
                                className="h-9 pl-9 pr-8 rounded-full bg-white/[0.04] border-white/10 text-xs sm:text-sm text-white placeholder:text-white/35 focus:border-cyan-400"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/45 hover:text-white cursor-pointer"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <span className="text-xs text-white/45 whitespace-nowrap font-medium">
                            {filteredProducts.length} {isEn ? "items" : "db"}
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section ref={resultsTopRef} className="py-8 md:py-10 flex-1 bg-[#030712] scroll-mt-32">
                <div className="container mx-auto px-4">
                    <motion.div
                        layout
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        title={product.localizedTitle}
                                        description={product.localizedDesc}
                                        price={product.price}
                                        category={product.category}
                                        slug={product.slug}
                                        image={product.image}
                                        onQuickView={() => {
                                            setQuickViewData({
                                                ...product,
                                                title: product.localizedTitle,
                                                description: product.localizedDesc,
                                                type: 'product'
                                            })
                                            setIsModalOpen(true)
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                            <p className="text-white/50">{t('no_products')}</p>
                            {(searchQuery || activeCategory !== "all") && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSearchQuery(""); handleCategoryClick("all") }}
                                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                                >
                                    {isEn ? "Reset filters" : "Szűrők törlése"}
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="mt-16 text-center border-t border-white/10 pt-10">
                        <h3 className="text-2xl font-bold text-white mb-3">{t('not_found_title')}</h3>
                        <p className="text-white/55 mb-6 max-w-xl mx-auto text-sm md:text-base">
                            {t('not_found_desc')}
                        </p>
                        <Button
                            size="lg"
                            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold"
                            asChild
                        >
                            <Link href="/ajanlatkeres">
                                {t('request_custom')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            <QuickViewModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={quickViewData}
            />
        </>
    )
}
