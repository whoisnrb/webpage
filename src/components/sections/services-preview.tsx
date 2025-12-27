"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Server, Shield, ShoppingCart, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

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
            features: [
                "Egyedi Python/Bash scriptek",
                "API integrációk (n8n, Make)",
                "Adatmentési automatizmusok",
                "Folyamatoptimalizálás"
            ]
        },
        {
            title: t('items.webdev.title'),
            description: t('items.webdev.description'),
            benefit: t('items.webdev.benefit'),
            icon: ShoppingCart,
            href: "/szolgaltatasok/webfejlesztes",
            features: [
                "Modern Next.js weboldalak",
                "WooCommerce & Shopify",
                "UI/UX tervezés",
                "SEO optimalizáció"
            ]
        },
        {
            title: t('items.devops.title'),
            description: t('items.devops.description'),
            benefit: t('items.devops.benefit'),
            icon: Server,
            href: "/szolgaltatasok/rendszeruzemeltetes",
            features: [
                "Cloud infrastruktúra (AWS, GC)",
                "Linux szerver felügyelet",
                "Docker & Kubernetes",
                "24/7 Monitoring"
            ]
        },
        {
            title: t('items.security.title'),
            description: t('items.security.description'),
            benefit: t('items.security.benefit'),
            icon: Shield,
            href: "/szolgaltatasok/biztonsag",
            features: [
                "Sérülékenység vizsgálat",
                "Webes tűzfal (WAF) setup",
                "Pénzügyi adatok védelme",
                "Biztonsági mentési stratégia"
            ]
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="group relative">
                            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <service.icon className="h-6 w-6" />
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
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <CardDescription className="text-base mb-4">
                                        {service.description}
                                    </CardDescription>
                                    <div className="flex items-center text-sm font-medium text-primary mb-6">
                                        {service.benefit}
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto">
                                    <Button asChild className="w-full">
                                        <Link href={service.href}>
                                            {tQuickView('details')}
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
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
