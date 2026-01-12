"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Code2, ShieldCheck, Lock, Award } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"

export function Footer() {
    const tStats = useTranslations("Footer")
    const tNav = useTranslations("Navigation")

    const signals = [
        { icon: Lock, label: tStats("signals.ssl") },
        { icon: ShieldCheck, label: tStats("signals.gdpr") },
        { icon: Award, label: tStats("signals.experts") }
    ]

    return (
        <footer className="relative border-t border-white/5 pt-16 pb-12 overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="md:col-span-4 lg:col-span-5 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-white">
                                Backline<span className="text-primary">IT</span>
                            </span>
                        </Link>
                        <p className="text-sm text-white/60 max-w-sm leading-relaxed">
                            {tStats("description")}
                        </p>
                        <div className="space-y-3 pt-2">
                            {signals.map((signal, i) => (
                                <div key={i} className="flex items-center gap-2 text-white/50">
                                    <signal.icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{signal.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h3 className="text-sm font-bold text-white mb-6">{tNav("services")}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/szolgaltatasok/scriptek" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("scripts")}</Link></li>
                            <li><Link href="/szolgaltatasok/webfejlesztes" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("web_dev")}</Link></li>
                            <li><Link href="/szolgaltatasok/integraciok" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("integrations")}</Link></li>
                            <li><Link href="/szolgaltatasok/rendszeruzemeltetes" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("devops")}</Link></li>
                            <li><Link href="/szolgaltatasok/biztonsag" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("security")}</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="text-sm font-bold text-white mb-6">{tStats("company")}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/rolunk" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("about")}</Link></li>
                            <li><Link href="/referenciak" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("references")}</Link></li>
                            <li><Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("blog")}</Link></li>
                            <li><Link href="/karrier" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("careers")}</Link></li>
                            <li><Link href="/kapcsolat" className="text-sm text-white/40 hover:text-white transition-colors">{tNav("contact")}</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h3 className="text-sm font-bold text-white mb-6">{tStats("newsletter")}</h3>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/20">
                        {tStats("rights", { year: new Date().getFullYear() })}
                    </p>
                    <div className="flex gap-6">
                        <Link href="/adatvedelem" className="text-xs text-white/40 hover:text-white transition-colors">{tNav("privacy")}</Link>
                        <Link href="/aszf" className="text-xs text-white/40 hover:text-white transition-colors">{tNav("terms")}</Link>
                        <Link href="/impresszum" className="text-xs text-white/40 hover:text-white transition-colors">{tNav("imprint")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
