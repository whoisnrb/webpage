"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, PlayCircle, ShieldCheck, Download } from "lucide-react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { ProductDTO, Variant } from "@/app/actions/product"
import { useTranslations } from 'next-intl'

interface ProductDetailClientProps {
    product: ProductDTO
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addItem } = useCart()
    const t = useTranslations('ProductDetailPage')
    const variants: Variant[] = Array.isArray(product.prices) ? product.prices : []
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants.length > 0 ? variants[0] : null)

    const handleAddToCart = () => {
        if (!selectedVariant) return

        addItem({
            id: product.id,
            name: product.title,
            price: selectedVariant.price,
            license: selectedVariant.name,
            image: product.image
        })
    }

    return (
        <div className="flex flex-col md:flex-row gap-12">
            {/* Product Visual */}
            <div className="flex-1">
                <div className="aspect-video bg-background rounded-xl border shadow-sm flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                    <PlayCircle className="h-20 w-20 text-primary/20 group-hover:text-primary/40 transition-colors cursor-pointer" />
                    <span className="absolute bottom-4 text-sm text-muted-foreground">{t('demo_video')}</span>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
                <div className="bg-card border rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4">{t('select_version')}</h3>
                    <div className="space-y-3">
                        {variants.length > 0 ? (
                            variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedVariant?.name === variant.name ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    <div>
                                        <div className="font-medium">{variant.name}</div>
                                        {variant.description && (
                                            <div className="text-xs text-muted-foreground">{variant.description}</div>
                                        )}
                                    </div>
                                    <div className="font-bold">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(variant.price)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground">{t('no_variants')}</div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t flex gap-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" /> {t('add_to_cart')}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>{t('verified_code')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-500" />
                        <span>{t('instant_download')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
