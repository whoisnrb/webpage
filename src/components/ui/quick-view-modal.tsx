"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useCart } from "@/components/ecommerce/cart-provider"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

interface QuickViewModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    data: {
        id: string
        title: string
        description: string
        price?: number
        category?: string
        image?: string
        features?: string[]
        slug: string
        type: 'product' | 'service'
    } | null
}

export function QuickViewModal({ isOpen, onOpenChange, data }: QuickViewModalProps) {
    const { addItem } = useCart()
    const t = useTranslations()

    if (!data) return null

    const handleAddToCart = () => {
        if (data.type === 'product' && data.price) {
            addItem({
                id: data.id,
                name: data.title,
                price: data.price,
                license: "personal",
                image: data.image
            })
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] gap-0 p-0 overflow-hidden bg-background border-primary/20">
                <div className="grid md:grid-cols-2">
                    {/* Visual Section */}
                    <div className="relative aspect-square md:aspect-auto bg-muted/30 flex items-center justify-center overflow-hidden">
                        {data.image ? (
                            <img
                                src={data.image}
                                alt={data.title}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="p-12 text-center">
                                <Badge variant="secondary" className="mb-4">{data.category || data.type}</Badge>
                                <div className="text-muted-foreground/20 font-bold text-4xl uppercase tracking-tighter">
                                    {data.title}
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <DialogHeader className="text-left mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 capitalize">
                                    {data.category || data.type}
                                </Badge>
                            </div>
                            <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight">
                                {data.title}
                            </DialogTitle>
                        </DialogHeader>

                        <DialogDescription className="text-base text-muted-foreground mb-6 line-clamp-4">
                            {data.description}
                        </DialogDescription>

                        {data.features && data.features.length > 0 && (
                            <div className="space-y-2 mb-8 flex-1">
                                {data.features.slice(0, 4).map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-6 border-t border-primary/10">
                            {data.price ? (
                                <div className="flex items-center justify-between mb-6">
                                    <PriceDisplay amount={data.price} className="text-2xl" />
                                    <span className="text-xs text-muted-foreground">{t('QuickView.price_note')}</span>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-4">
                                {data.type === 'product' && data.price ? (
                                    <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-white">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {t('QuickView.add_to_cart')}
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                                        <Link href="/kapcsolat" onClick={() => onOpenChange(false)}>
                                            {t('QuickView.request_quote')}
                                        </Link>
                                    </Button>
                                )}
                                <Button asChild variant="secondary" className="w-full group">
                                    <Link href={data.type === 'product' ? `/termekek/${data.slug}` : data.slug} onClick={() => onOpenChange(false)}>
                                        {t('QuickView.details')}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
