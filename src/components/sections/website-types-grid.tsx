"use client"

import { 
    Monitor, Plus, LayoutGrid, ShoppingCart, Home, FileText, 
    Globe, Users, MessageSquare, BookOpen, CalendarRange, List, 
    FolderOpen, DollarSign, Terminal, File, User, Heart, Video, 
    LayoutDashboard, ArrowRight
} from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { Link } from "@/i18n/routing"

export function WebsiteTypesGrid() {
    const t = useTranslations("Services.WebDev.websiteTypes")

    const types = [
        { id: "presentation", icon: Monitor },
        { id: "landing", icon: Plus },
        { id: "portfolio", icon: LayoutGrid },
        { id: "webshop", icon: ShoppingCart },
        { id: "corporate", icon: Home },
        { id: "blog", icon: FileText },
        { id: "news", icon: Globe },
        { id: "social", icon: Users },
        { id: "forum", icon: MessageSquare },
        { id: "education", icon: BookOpen },
        { id: "booking", icon: CalendarRange },
        { id: "classified", icon: List },
        { id: "catalog", icon: FolderOpen },
        { id: "membership", icon: DollarSign },
        { id: "webapp", icon: Terminal },
        { id: "onepage", icon: File },
        { id: "cv", icon: User },
        { id: "nonprofit", icon: Heart },
        { id: "media", icon: Video },
        { id: "portal", icon: LayoutDashboard },
    ]

    return (
        <section className="py-24 md:py-32 bg-[#08080a] relative overflow-hidden">
            {/* Dark background, orange/amber subtle glows based on screenshots */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            {t("title")}
                        </h2>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium">
                            {t("subtitle")}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
                    {types.map((type, index) => {
                        const Icon = type.icon
                        const typeName = t(`items.${type.id}.title`)
                        return (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="group h-full"
                            >
                                <Link href={{ pathname: '/ajanlatkeres', query: { subject: typeName } }} className="block h-full">
                                    <div className="relative h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:bg-slate-800/80 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.15)] flex flex-col">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-12 h-12 border border-orange-500/20 rounded-xl text-orange-400 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-orange-50 transition-colors leading-tight">
                                                {typeName}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-sm text-slate-400 mb-8 flex-1 leading-relaxed">
                                            {t(`items.${type.id}.description`)}
                                        </p>
                                        
                                        <div className="mt-auto flex flex-col items-center w-full">
                                            <div className="bg-slate-800/80 border border-slate-700/50 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-300 mb-6">
                                                {t(`items.${type.id}.badge`)}
                                            </div>
                                            
                                            <div className="text-orange-400 text-sm font-bold flex items-center opacity-80 group-hover:opacity-100 transition-all">
                                                {t("clickToQuote")} 
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
