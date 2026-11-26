"use client"

import { Link } from "@/i18n/routing"
import { ArrowRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

interface ProductCardProps {
    id: string
    title: string
    description: string
    price: number
    category: string
    slug: string
    image?: string
    onQuickView?: () => void
}

export function ProductCard({ title, description, price, category, slug, image, onQuickView }: ProductCardProps) {
    const t = useTranslations()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="h-full"
        >
            <div className="flex flex-col overflow-hidden h-full rounded-2xl border border-white/10 bg-[#06101c]/80 backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] transition-all duration-300 group">
                {/* Clickable Visual Header */}
                <div className="aspect-video bg-slate-900/70 relative overflow-hidden">
                    <Link href={`/megoldasok/${slug}` as any} className="block w-full h-full">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt={title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                            />
                        ) : null}

                        {/* Fallback / Placeholder */}
                        <div className={`absolute inset-0 flex items-center justify-center text-white/30 font-medium bg-gradient-to-br ${
                            category === 'WordPress Plugin' ? 'from-blue-500/20 to-purple-500/20' :
                            category === 'Automatizáció' ? 'from-orange-500/20 to-red-500/20' :
                            category === 'Script' ? 'from-green-500/20 to-emerald-500/20' :
                            category === 'E-book' ? 'from-yellow-500/20 to-amber-500/20' :
                            'from-cyan-500/20 to-slate-800/40'
                        } ${image ? 'hidden' : ''}`}>
                            {category}
                        </div>
                    </Link>

                    {/* Top-left Category Badge */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <Badge variant="outline" className="bg-slate-950/80 backdrop-blur-md border-white/15 text-cyan-300 text-[11px] font-semibold">
                            {category}
                        </Badge>
                    </div>

                    {/* Top-right Quick View Button (always accessible on mobile & desktop) */}
                    {onQuickView && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onQuickView()
                            }}
                            title={t('QuickView.quick_view')}
                            aria-label={t('QuickView.quick_view')}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white/80 hover:text-cyan-300 hover:border-cyan-400/50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                        <Link href={`/megoldasok/${slug}` as any} className="block">
                            <h3 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
                                {title}
                            </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-white/55 line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <PriceDisplay amount={price} className="text-xl md:text-2xl font-black text-white block" />

                        <Button
                            className="w-full h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/15 transition-all group/btn"
                            asChild
                        >
                            <Link href={`/megoldasok/${slug}` as any}>
                                {t('QuickView.details')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
