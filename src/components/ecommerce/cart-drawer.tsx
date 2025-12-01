"use client"

import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/ecommerce/cart-provider"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@/i18n/routing"

export function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const { items, removeItem, total, itemCount } = useCart()

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(true)}
            >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-xs text-white flex items-center justify-center font-bold">
                        {itemCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 h-screen w-full max-w-xl bg-background shadow-2xl z-[100] border-l flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b bg-muted/10">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <ShoppingCart className="h-5 w-5 text-primary" />
                                    </div>
                                    Kosár tartalma
                                    <span className="text-sm font-normal text-muted-foreground ml-1">({itemCount} termék)</span>
                                </h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-muted rounded-full">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                                        <ShoppingCart className="h-12 w-12 opacity-20" />
                                        <p>A kosarad üres.</p>
                                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                                            Vásárlás folytatása
                                        </Button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={`${item.id}-${item.license}`} className="flex gap-4 p-3 border rounded-lg bg-card">
                                            <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground font-medium overflow-hidden relative">
                                                {item.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                                                        IMG
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground capitalize">{item.license} licenc</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="text-sm font-bold">
                                                        {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(item.price)}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive hover:text-destructive/90"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-4 border-t bg-muted/10 space-y-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Összesen:</span>
                                        <span>{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(total)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Alanyi adómentes (AAM) - A feltüntetett árak a fizetendő végösszegek.
                                    </p>
                                    <Button className="w-full bg-accent hover:bg-accent/90 text-white" size="lg" asChild>
                                        <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                            Tovább a pénztárhoz <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
