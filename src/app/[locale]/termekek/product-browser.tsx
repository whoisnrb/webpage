"use client"

import { useState } from "react"
import { ProductCard } from "@/components/ecommerce/product-card"
import { Button } from "@/components/ui/button"
import { ProductDTO } from "@/app/actions/product"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

interface ProductBrowserProps {
    initialProducts: ProductDTO[]
}

export function ProductBrowser({ initialProducts }: ProductBrowserProps) {
    const t = useTranslations("Products")
    const [activeCategory, setActiveCategory] = useState("all")
    const [quickViewData, setQuickViewData] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            <section className="py-8 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max justify-center">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(cat.id)}
                                className="rounded-full transition-all duration-300"
                            >
                                {cat.label}
                            </Button>
                        ))}
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
                            {filteredProducts.map((product) => (
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
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        category={product.category}
                                        slug={product.slug}
                                        image={product.image}
                                        onQuickView={() => {
                                            setQuickViewData({
                                                ...product,
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
                        <div className="text-center py-20 text-muted-foreground">
                            {t('no_products')}
                        </div>
                    )}

                    <div className="mt-20 text-center border-t pt-12">
                        <h3 className="text-2xl font-bold mb-4">{t('not_found_title')}</h3>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            {t('not_found_desc')}
                        </p>
                        <Button variant="outline" size="lg" onClick={() => window.location.href = '/ajanlatkeres'}>
                            {t('request_custom')}
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
