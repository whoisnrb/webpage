"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, ShoppingCart, Zap, Shield, Sparkles, Box, Layers, MousePointer2 } from "lucide-react"
import { cn } from "@/lib/utils"


const FloatingElement = ({ delay, className, children }: { delay: number, className?: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className={cn("absolute pointer-events-none", className)}
    >
        {children}
    </motion.div>
)

export function SplitHero() {
    const t = useTranslations("SplitHero")
    const [hoverSide, setHoverSide] = React.useState<'left' | 'right' | null>(null)

    return (
        <section className="relative w-full h-[700px] md:h-screen min-h-[600px] overflow-hidden bg-transparent">

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={cn(
                    "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 opacity-20",
                    hoverSide === 'left' ? "bg-cyan-500 scale-125" : "bg-primary"
                )} />
                <div className={cn(
                    "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 opacity-20",
                    hoverSide === 'right' ? "bg-orange-500 scale-125" : "bg-purple-500"
                )} />
            </div>

            <div className="flex flex-col md:flex-row h-full w-full relative z-10">

                {/* Left Side: Services */}
                <div
                    className={cn(
                        "relative flex-1 flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden group/left",
                        hoverSide === 'left' ? 'md:flex-[1.8] bg-primary/5' : hoverSide === 'right' ? 'md:flex-[0.6] grayscale opacity-40' : 'md:flex-1'
                    )}
                    onMouseEnter={() => setHoverSide('left')}
                    onMouseLeave={() => setHoverSide(null)}
                >
                    {/* Visual Flourishes for Left */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <FloatingElement delay={0} className="top-1/4 left-1/4 text-primary/20">
                            <Code size={120} />
                        </FloatingElement>
                        <FloatingElement delay={1} className="bottom-1/4 right-1/3 text-cyan-500/10">
                            <Layers size={80} />
                        </FloatingElement>
                        <FloatingElement delay={2} className="top-1/3 right-1/4 text-primary/10">
                            <Shield size={60} />
                        </FloatingElement>
                    </div>

                    <motion.div
                        className="relative z-20 text-center flex flex-col items-center max-w-xl"
                        layout
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                scale: hoverSide === 'left' ? 1.1 : 1,
                                backgroundColor: hoverSide === 'left' ? "rgba(var(--primary), 0.2)" : "rgba(var(--primary), 0.1)"
                            }}
                            className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-2xl relative"
                        >
                            <Code className="h-10 w-10 text-primary" />
                            <motion.div
                                animate={{ opacity: hoverSide === 'left' ? 1 : 0 }}
                                className="absolute -top-1 -right-1 h-4 w-4 bg-cyan-400 rounded-full animate-ping"
                            />
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[0.9] lg:leading-[0.85]">
                            <span className="block opacity-70 group-hover/left:opacity-100 transition-opacity">{t('left_title_1')}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary/80 animate-gradient-x bg-[length:200%_auto] block">
                                {t('left_title_2')}
                            </span>
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed font-medium">
                            {t('left_desc')}
                        </p>

                        <div className="relative group/btn">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full blur opacity-40 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200 pointer-events-none" />
                            <Button asChild size="lg" className="relative z-10 h-14 px-10 text-xl font-bold rounded-full bg-background hover:bg-background text-foreground border-none shadow-2xl transition-transform hover:scale-105">
                                <Link href="/szolgaltatasok">
                                    {t('left_cta')} <ArrowRight className="ml-2 h-6 w-6 group-hover/left:translate-x-2 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        {/* Social Proof/Stats Snippet */}
                        <div className="mt-12 flex gap-8 items-center opacity-0 group-hover/left:opacity-100 transition-all duration-700 translate-y-4 group-hover/left:translate-y-0">
                            <div>
                                <div className="text-2xl font-bold text-primary">50+</div>
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('stat_projects_label')}</div>
                            </div>
                            <div className="w-[1px] h-8 bg-border" />
                            <div>
                                <div className="text-2xl font-bold text-primary">100%</div>
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('stat_satisfaction_label')}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Divider (Futuristic Beam) */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent z-30 hidden md:block">
                    <motion.div
                        animate={{
                            top: ["0%", "100%", "0%"],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-24 bg-gradient-to-b from-transparent via-primary to-transparent blur-md"
                    />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-background/80 backdrop-blur-3xl border border-primary/20 rounded-full p-4 shadow-[0_0_30px_rgba(var(--primary),0.3)] select-none">
                        <div className="relative">
                            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Right Side: Products */}
                <div
                    className={cn(
                        "relative flex-1 flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden group/right",
                        hoverSide === 'right' ? 'md:flex-[1.8] bg-accent/5' : hoverSide === 'left' ? 'md:flex-[0.6] grayscale opacity-40' : 'md:flex-1'
                    )}
                    onMouseEnter={() => setHoverSide('right')}
                    onMouseLeave={() => setHoverSide(null)}
                >
                    {/* Visual Flourishes for Right */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <FloatingElement delay={0.5} className="top-1/4 right-1/4 text-accent/20">
                            <ShoppingCart size={120} />
                        </FloatingElement>
                        <FloatingElement delay={1.5} className="bottom-1/4 left-1/3 text-orange-500/10">
                            <Box size={80} />
                        </FloatingElement>
                        <FloatingElement delay={2.5} className="top-1/3 left-1/4 text-accent/10">
                            <Zap size={60} />
                        </FloatingElement>

                        {/* Abstract Shapes */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover/right:bg-accent/10 transition-colors" />
                    </div>

                    <motion.div
                        className="relative z-20 text-center flex flex-col items-center max-w-xl"
                        layout
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                scale: hoverSide === 'right' ? 1.1 : 1,
                                backgroundColor: hoverSide === 'right' ? "rgba(249, 115, 22, 0.2)" : "rgba(249, 115, 22, 0.1)"
                            }}
                            className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 shadow-2xl relative"
                        >
                            <ShoppingCart className="h-10 w-10 text-accent" />
                            <motion.div
                                animate={{ opacity: hoverSide === 'right' ? 1 : 0 }}
                                className="absolute -top-1 -left-1 h-4 w-4 bg-orange-400 rounded-full animate-ping"
                            />
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[0.9] lg:leading-[0.85]">
                            <span className="block opacity-70 group-hover/right:opacity-100 transition-opacity">{t('right_title_1')}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-accent/80 animate-gradient-x bg-[length:200%_auto] block">
                                {t('right_title_2')}
                            </span>
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed font-medium">
                            {t('right_desc')}
                        </p>

                        <div className="relative group/btn">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-500 rounded-full blur opacity-40 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200 pointer-events-none" />
                            <Button asChild size="lg" className="relative z-10 h-14 px-10 text-xl font-bold rounded-full bg-background hover:bg-background text-foreground border-none shadow-2xl transition-transform hover:scale-105">
                                <Link href="/termekek">
                                    {t('right_cta')} <ArrowRight className="ml-2 h-6 w-6 group-hover/right:translate-x-2 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        {/* Product Highlights snippet */}
                        <div className="mt-12 flex gap-4 items-center opacity-0 group-hover/right:opacity-100 transition-all duration-700 translate-y-4 group-hover/right:translate-y-0">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('ready_to_ship')}</span>
                            <Badge variant="outline" className="bg-orange-500/20 border-orange-400/40 text-orange-300">{t('badge_scripts')}</Badge>
                            <Badge variant="outline" className="bg-orange-500/20 border-orange-400/40 text-orange-300">{t('badge_plugins')}</Badge>
                            <Badge variant="outline" className="bg-orange-500/20 border-orange-400/40 text-orange-300">{t('badge_ebooks')}</Badge>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile "OR" Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden z-50 pointer-events-none">
                <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full px-4 py-1 flex items-center gap-2 shadow-2xl">
                    <MousePointer2 className="h-3 w-3 text-primary animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{t('choose_path')}</span>
                </div>
            </div>

        </section>
    )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
            variant === 'outline' ? "border" : "bg-primary text-primary-foreground",
            className
        )}>
            {children}
        </span>
    )
}
