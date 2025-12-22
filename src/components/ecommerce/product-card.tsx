"use client"

import { Link } from "@/i18n/routing"
import { ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/ecommerce/cart-provider"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

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

export function ProductCard({ id, title, description, price, category, slug, image, onQuickView }: ProductCardProps) {
    const { addItem } = useCart()
    const t = useTranslations()

    const handleAddToCart = () => {
        addItem({
            id,
            name: title,
            price,
            license: "personal", // Default to personal for quick add
            image
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className="flex flex-col overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-muted-foreground/10">
                <div className="aspect-video bg-muted/50 relative group overflow-hidden">
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt={title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                        />
                    ) : null}

                    {/* Fallback / Placeholder */}
                    <div className={`absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-medium bg-gradient-to-br ${category === 'WordPress Plugin' ? 'from-blue-500/20 to-purple-500/20' :
                        category === 'Automatizáció' ? 'from-orange-500/20 to-red-500/20' :
                            category === 'Script' ? 'from-green-500/20 to-emerald-500/20' :
                                category === 'E-book' ? 'from-yellow-500/20 to-amber-500/20' :
                                    'from-gray-500/20 to-slate-500/20'
                        } ${image ? 'hidden' : ''}`}>
                        {category}
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault()
                                onQuickView?.()
                            }}
                            className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                            <Eye className="mr-2 h-4 w-4" /> {t('QuickView.quick_view')}
                        </Button>
                        <Button size="sm" variant="outline" asChild className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 border-white text-white hover:bg-white/20">
                            <Link href={`/termekek/${slug}`}>
                                {t('QuickView.details')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-background/50 backdrop-blur">{category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{title}</CardTitle>
                    <CardDescription className="line-clamp-2">{description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <div className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(price)}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white group" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Kosárba
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
