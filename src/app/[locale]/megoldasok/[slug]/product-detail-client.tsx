"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, PlayCircle, ShieldCheck, ArrowRight } from "lucide-react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { LocalizedProductDTO, Variant } from "@/app/actions/product"
import { useTranslations, useLocale } from 'next-intl'
import { PriceDisplay } from "@/components/price-display"
import { useRouter } from "@/i18n/routing"

interface ProductDetailClientProps {
    product: LocalizedProductDTO
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addItem } = useCart()
    const t = useTranslations('ProductDetailPage')
    const locale = useLocale()
    const isEn = locale === 'en'
    const router = useRouter()
    const variants: Variant[] = Array.isArray(product.prices) ? product.prices : []
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants.length > 0 ? variants[0] : null)

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const youtubeId = product.demoVideoUrl ? getYoutubeId(product.demoVideoUrl) : null

    const handleRequestConsultation = () => {
        if (selectedVariant) {
            addItem({
                id: product.id,
                name: product.title,
                price: selectedVariant.price,
                license: selectedVariant.name,
                image: product.image
            })
        }
        router.push(`/konzultacio?product=${encodeURIComponent(product.slug)}` as any)
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            {/* Product Visual (Video or Product Cover Image) */}
            <div className="flex-1 w-full">
                <div className="aspect-video bg-[#06101c] rounded-2xl border border-white/10 shadow-[0_0_40px_-15px_rgba(6,182,212,0.2)] flex items-center justify-center relative overflow-hidden">
                    {youtubeId ? (
                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
                            <iframe
                                className="absolute top-[-15%] left-0 w-full h-[130%]"
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0&autohide=1&iv_load_policy=3`}
                                title="Product Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.image}
                            alt={product.title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                            <PlayCircle className="h-16 w-16 text-cyan-400/30" />
                            <span className="absolute bottom-4 text-xs text-white/50">{t('demo_video')}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Product Info & Package Selection */}
            <div className="flex-1 w-full">
                <div className="rounded-2xl border border-white/10 bg-[#06101c]/80 backdrop-blur-2xl p-6 mb-5 shadow-[0_0_40px_-15px_rgba(6,182,212,0.15)]">
                    <h3 className="font-bold text-white mb-4">
                        {variants.length > 0 ? t('select_version') : (isEn ? "Solution Overview" : "Megoldás áttekintése")}
                    </h3>
                    <div className="space-y-3">
                        {variants.length > 0 ? (
                            variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                                        selectedVariant?.name === variant.name
                                            ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25'
                                    }`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    <div>
                                        <div className="font-semibold text-white text-sm">{variant.name}</div>
                                        {variant.description && (
                                            <div className="text-xs text-white/55 mt-0.5">{variant.description}</div>
                                        )}
                                    </div>
                                    <PriceDisplay amount={variant.price} className="font-black text-cyan-300" />
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                                <span className="text-sm text-white/60">{t('no_variants')}</span>
                                <PriceDisplay amount={product.price} className="font-black text-xl text-cyan-300" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10">
                        <Button
                            size="lg"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                            onClick={handleRequestConsultation}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            <span>{t('request_consultation')}</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>{t('secure_solution')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-cyan-400" />
                        <span>{t('fast_implementation')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
