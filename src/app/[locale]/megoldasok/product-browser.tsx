"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/ecommerce/product-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { LocalizedProductDTO } from "@/app/actions/product"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

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
    const searchParams = useSearchParams()
    const [activeCategory, setActiveCategory] = useState<string>(() =>
        parseCategoryParam(searchParams.get("category"))
    )
    const [quickViewData, setQuickViewData] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
    }

    const categories = [
        { id: "all", label: t("categories.all") },
        { id: "WordPress Plugin", label: t("categories.wordpress") },
        { id: "Automatizáció", label: t("categories.automation") },
        { id: "Script", label: t("categories.script") },
        { id: "Template", label: t("categories.template") },
        { id: "E-book", label: t("categories.ebook") }
    ]

    // We use the passed products instead of the static import
    const filteredProducts = activeCategory === "all"
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory)

    return (
        <>
            <section className="sticky top-20 z-40 py-4 transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 bg-primary rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-16 flex-1">
                <div className="container mx-auto px-4">
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => {
                                const titleKey = `${product.slug}.title`
                                const descKey = `${product.slug}.description`
                                const localizedTitle = t.has(titleKey) ? t(titleKey) : product.title
                                const localizedDesc = t.has(descKey) ? t(descKey) : product.description

                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            title={localizedTitle}
                                            description={localizedDesc}
                                            price={product.price}
                                            category={product.category}
                                            slug={product.slug}
                                            image={product.image}
                                            onQuickView={() => {
                                                setQuickViewData({
                                                    ...product,
                                                    title: localizedTitle,
                                                    description: localizedDesc,
                                                    type: 'product'
                                                })
                                                setIsModalOpen(true)
                                            }}
                                        />
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            {t('no_products')}
                        </div>
                    )}

                    <div className="mt-20 text-center border-t pt-12">
                        <h3 className="text-2xl font-bold mb-4">{t('not_found_title')}</h3>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            {t('not_found_desc')}
                        </p>
                        <Button variant="outline" size="lg" asChild>
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
