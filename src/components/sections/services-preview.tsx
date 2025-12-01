"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Server, Shield, ShoppingCart, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function ServicesPreview() {
    const t = useTranslations('ServicesPreview')

    const services = [
        {
            title: t('items.automation.title'),
            description: t('items.automation.description'),
            benefit: t('items.automation.benefit'),
            icon: Code,
            href: "/szolgaltatasok/scriptek"
        },
        {
            title: t('items.webdev.title'),
            description: t('items.webdev.description'),
            benefit: t('items.webdev.benefit'),
            icon: ShoppingCart,
            href: "/szolgaltatasok/webfejlesztes"
        },
        {
            title: t('items.devops.title'),
            description: t('items.devops.description'),
            benefit: t('items.devops.benefit'),
            icon: Server,
            href: "/szolgaltatasok/rendszeruzemeltetes"
        },
        {
            title: t('items.security.title'),
            description: t('items.security.description'),
            benefit: t('items.security.benefit'),
            icon: Shield,
            href: "/szolgaltatasok/biztonsag"
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
                        <Link key={index} href={service.href} className="group">
                            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <service.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base mb-4">
                                        {service.description}
                                    </CardDescription>
                                    <div className="flex items-center text-sm font-medium text-primary">
                                        {service.benefit}
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
