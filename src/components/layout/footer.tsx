"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Code2 } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"

export function Footer() {
    const tStats = useTranslations("Footer")
    const tNav = useTranslations("Navigation")

    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold tracking-tight text-primary">
                                <span className="font-bold text-xl tracking-tight">
                                    Backline<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">IT</span>
                                </span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            {tStats("description")}
                        </p>

                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">{tNav("services")}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/szolgaltatasok/scriptek" className="hover:text-primary">{tNav("scripts")}</Link></li>
                            <li><Link href="/szolgaltatasok/webfejlesztes" className="hover:text-primary">{tNav("web_dev")}</Link></li>
                            <li><Link href="/szolgaltatasok/integraciok" className="hover:text-primary">{tNav("integrations")}</Link></li>
                            <li><Link href="/szolgaltatasok/rendszeruzemeltetes" className="hover:text-primary">{tNav("devops")}</Link></li>
                            <li><Link href="/szolgaltatasok/biztonsag" className="hover:text-primary">{tNav("security")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">{tStats("company")}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/rolunk" className="hover:text-primary">{tNav("about")}</Link></li>
                            <li><Link href="/referenciak" className="hover:text-primary">{tNav("references")}</Link></li>
                            <li><Link href="/blog" className="hover:text-primary">{tNav("blog")}</Link></li>
                            <li><Link href="/karrier" className="hover:text-primary">{tNav("careers")}</Link></li>
                            <li><Link href="/kapcsolat" className="hover:text-primary">{tNav("contact")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">{tStats("newsletter")}</h3>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BacklineIT. {tNav("rights_reserved")}</p>
                    <div className="flex gap-6">
                        <Link href="/adatvedelem" className="hover:text-primary">{tNav("privacy")}</Link>
                        <Link href="/aszf" className="hover:text-primary">{tNav("terms")}</Link>
                        <Link href="/impresszum" className="hover:text-primary">{tNav("imprint")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
