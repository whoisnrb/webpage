"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, PlayCircle, ShieldCheck, Download } from "lucide-react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { ProductDTO } from "@/app/actions/product"

interface ProductDetailClientProps {
    product: ProductDTO
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addItem } = useCart()
    const [license, setLicense] = useState<"personal" | "commercial" | "developer">("personal")

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.prices?.[license] || product.price,
            license: license,
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
                    <span className="absolute bottom-4 text-sm text-muted-foreground">Demo Videó Lejátszása</span>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
                <div className="bg-card border rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4">Válassz licencet:</h3>
                    <div className="space-y-3">
                        <div
                            className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${license === 'personal' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            onClick={() => setLicense('personal')}
                        >
                            <div>
                                <div className="font-medium">Personal License</div>
                                <div className="text-xs text-muted-foreground">1 weboldalhoz</div>
                            </div>
                            <div className="font-bold">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(product.prices?.personal || 0)}</div>
                        </div>

                        <div
                            className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${license === 'commercial' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            onClick={() => setLicense('commercial')}
                        >
                            <div>
                                <div className="font-medium">Commercial License</div>
                                <div className="text-xs text-muted-foreground">5 weboldalhoz + Priority Support</div>
                            </div>
                            <div className="font-bold">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(product.prices?.commercial || 0)}</div>
                        </div>

                        <div
                            className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${license === 'developer' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            onClick={() => setLicense('developer')}
                        >
                            <div>
                                <div className="font-medium">Developer License</div>
                                <div className="text-xs text-muted-foreground">Korlátlan weboldal + Forráskód</div>
                            </div>
                            <div className="font-bold">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(product.prices?.developer || 0)}</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t flex gap-4">
                        <Button size="lg" className="w-full bg-muted text-muted-foreground cursor-not-allowed" disabled>
                            <ShoppingCart className="mr-2 h-5 w-5" /> Hamarosan
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>Ellenőrzött kód</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-500" />
                        <span>Azonnali letöltés</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
