"use client"

import { useState } from "react"
import { ProductCard } from "@/components/ecommerce/product-card"
import { Button } from "@/components/ui/button"
import { ProductDTO } from "@/app/actions/product"
import { motion, AnimatePresence } from "framer-motion"

const categories = ["Összes", "WordPress Plugin", "Automatizáció", "Script", "Template", "E-book"]

interface ProductBrowserProps {
    initialProducts: ProductDTO[]
}

export function ProductBrowser({ initialProducts }: ProductBrowserProps) {
    const [activeCategory, setActiveCategory] = useState("Összes")

    // We use the passed products instead of the static import
    const filteredProducts = activeCategory === "Összes"
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory)

    return (
        <>
            <section className="py-8 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max justify-center">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(cat)}
                                className="rounded-full transition-all duration-300"
                            >
                                {cat}
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
                                    <ProductCard {...product as any} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            Nem található termék ebben a kategóriában.
                        </div>
                    )}

                    <div className="mt-20 text-center border-t pt-12">
                        <h3 className="text-2xl font-bold mb-4">Nem találod amit keresel?</h3>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Egyedi scriptre vagy automatizációra van szükséged? Írd meg az elképzelésedet, és elkészítjük neked!
                        </p>
                        <Button variant="outline" size="lg" onClick={() => window.location.href = '/ajanlatkeres'}>
                            Egyedi fejlesztés kérése
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}
