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
import { ShoppingCart, ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useCart } from "@/components/ecommerce/cart-provider"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { motion, AnimatePresence } from "framer-motion"

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
            <DialogContent className="sm:max-w-[900px] gap-0 p-0 overflow-hidden bg-[#020617]/95 backdrop-blur-3xl border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-[3rem]">
                <div className="grid md:grid-cols-5 h-full">

                    {/* Visual Section (Left) */}
                    <div className="md:col-span-2 relative bg-white/[0.02] border-r border-white/5 overflow-hidden flex items-center justify-center p-12">
                        {/* Abstract Background Decoration */}
                        <div className="absolute inset-0 z-0 opacity-20 bg-grid-white" />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 w-full flex flex-col items-center"
                        >
                            {data.image ? (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img
                                        src={data.image}
                                        alt={data.title}
                                        className="relative z-10 w-full rounded-2xl shadow-2xl border border-white/10"
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="h-24 w-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                        <Sparkles className="h-10 w-10 text-primary" />
                                    </div>
                                    <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-4 py-1.5 uppercase font-black tracking-widest text-[10px]">
                                        {data.type}
                                    </Badge>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Content Section (Right) */}
                    <div className="md:col-span-3 p-8 md:p-12 flex flex-col relative">

                        <div className="mb-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <span className="h-1.5 w-8 bg-primary rounded-full" />
                                <span className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">
                                    {data.category || (data.type === 'service' ? 'Innovation' : 'Premium Asset')}
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none"
                            >
                                {data.title}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-white/40 leading-relaxed font-medium mb-10"
                            >
                                {data.description}
                            </motion.p>

                            {data.features && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    {data.features.slice(0, 4).map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors">
                                            <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            </div>
                                            <span className="text-sm font-bold text-white/60">{f}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer / Actions */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-auto pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Starting from</span>
                                {data.price ? (
                                    <PriceDisplay amount={data.price} className="text-3xl font-black text-white tracking-tighter" />
                                ) : (
                                    <span className="text-3xl font-black text-white tracking-tighter">Custom</span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {data.type === 'product' && data.price ? (
                                    <Button
                                        onClick={handleAddToCart}
                                        className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tighter text-sm rounded-2xl shadow-[0_15px_30px_-10px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95"
                                    >
                                        <ShoppingCart className="mr-3 h-5 w-5" />
                                        Unlock Now
                                    </Button>
                                ) : (
                                    <Button
                                        asChild
                                        className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tighter text-sm rounded-2xl shadow-[0_15px_30px_-10px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
                                    >
                                        <Link href="/kapcsolat" onClick={() => onOpenChange(false)}>
                                            Get Started
                                            <ArrowRight className="ml-3 h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}

                                <Button
                                    asChild
                                    variant="ghost"
                                    className="h-14 px-8 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl font-bold transition-all"
                                >
                                    <Link href={data.type === 'product' ? `/megoldasok/${data.slug}` : data.slug} onClick={() => onOpenChange(false)}>
                                        Details
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
