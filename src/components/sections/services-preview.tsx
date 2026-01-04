"use client"

import { Code, Server, Shield, ShoppingCart, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { cn } from "@/lib/utils"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export function ServicesPreview() {
    const t = useTranslations('ServicesPreview')
    const tQuickView = useTranslations('QuickView')
    const [selectedService, setSelectedService] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const services = [
        {
            title: t('items.automation.title'),
            description: t('items.automation.description'),
            benefit: t('items.automation.benefit'),
            icon: Code,
            href: "/szolgaltatasok/scriptek",
            className: "md:col-span-2 md:row-span-1",
            color: "rgba(6, 182, 212, 0.15)", // Cyan
            extra: (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 font-mono text-[10px] space-y-1 overflow-hidden h-24 relative group-hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 text-primary/70">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Workflow: "Order Processor" - ACTIVE</span>
                    </div>
                    <div className="text-muted-foreground">
                        [16:54:20] FETCH orders FROM simplepay...
                    </div>
                    <div className="text-muted-foreground">
                        [16:54:21] PARSING 12 items...
                    </div>
                    <div className="text-muted-foreground">
                        [16:54:23] SYNCED with "Marketing DB"
                    </div>
                    <div className="absolute bottom-1 right-2 text-[8px] text-primary/30 uppercase tracking-widest">Auto-running</div>
                </div>
            )
        },
        {
            title: t('items.webdev.title'),
            description: t('items.webdev.description'),
            benefit: t('items.webdev.benefit'),
            icon: ShoppingCart,
            href: "/szolgaltatasok/webfejlesztes",
            className: "md:col-span-1 md:row-span-2",
            color: "rgba(249, 115, 22, 0.15)", // Orange
            extra: (
                <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-24 w-24">
                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">98</span>
                            <span className="text-[8px] uppercase font-bold text-muted-foreground">Performance</span>
                        </div>
                    </div>
                    <div className="w-full space-y-2">
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[94%]" />
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[88%]" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('items.devops.title'),
            description: t('items.devops.description'),
            benefit: t('items.devops.benefit'),
            icon: Server,
            href: "/szolgaltatasok/rendszeruzemeltetes",
            className: "md:col-span-1 md:row-span-1",
            color: "rgba(168, 85, 247, 0.15)", // Purple
            extra: (
                <div className="mt-4 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-2 bg-green-500/20 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: t('items.security.title'),
            description: t('items.security.description'),
            benefit: t('items.security.benefit'),
            icon: Shield,
            href: "/szolgaltatasok/biztonsag",
            className: "md:col-span-1 md:row-span-1",
            color: "rgba(239, 68, 68, 0.15)", // Red
            extra: (
                <div className="mt-4 flex items-center justify-center h-16">
                    <Shield className="h-12 w-12 text-blue-500/40 animate-pulse" />
                    <div className="absolute flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full border border-green-500/50 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]" />
                        </div>
                    </div>
                </div>
            )
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {t('title_1')} <span className="text-primary">{t('title_2')}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <div key={index} className={cn("group flex", service.className)}>
                            <SpotlightCard
                                className="border-none shadow-md hover:shadow-xl transition-all duration-300 w-full relative overflow-hidden flex flex-col p-6 backdrop-blur-xl bg-card/40"
                                spotlightColor={service.color}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <service.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            setSelectedService({
                                                ...service,
                                                id: `service-${index}`,
                                                type: 'service',
                                                slug: service.href
                                            })
                                            setIsModalOpen(true)
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center text-sm font-semibold text-primary mb-2">
                                        {service.benefit}
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>

                                    {service.extra}
                                </div>

                                <div className="mt-6">
                                    <Button asChild className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border-none transition-all duration-300">
                                        <Link href={service.href}>
                                            {tQuickView('details')}
                                        </Link>
                                    </Button>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            </div>

            <QuickViewModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={selectedService}
            />
        </section>
    )
}
