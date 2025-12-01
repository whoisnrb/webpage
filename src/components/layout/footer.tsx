import { Link } from "@/i18n/routing"
import { Code2, Facebook, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NewsletterForm } from "@/components/newsletter-form"

export function Footer() {
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
                            Professzionális informatikai szolgáltatások, scriptek és automatizációk vállalkozások számára. Spórolj időt és pénzt modern megoldásainkkal.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">Szolgáltatások</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/szolgaltatasok/scriptek" className="hover:text-primary">Scriptek & Automatizáció</Link></li>
                            <li><Link href="/szolgaltatasok/webfejlesztes" className="hover:text-primary">Webfejlesztés</Link></li>
                            <li><Link href="/szolgaltatasok/integraciok" className="hover:text-primary">Integrációk & API</Link></li>
                            <li><Link href="/szolgaltatasok/rendszeruzemeltetes" className="hover:text-primary">DevOps & Hosting</Link></li>
                            <li><Link href="/szolgaltatasok/biztonsag" className="hover:text-primary">Biztonság & Audit</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">Cég</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/rolunk" className="hover:text-primary">Rólunk</Link></li>
                            <li><Link href="/referenciak" className="hover:text-primary">Referenciák</Link></li>
                            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                            <li><Link href="/karrier" className="hover:text-primary">Karrier</Link></li>
                            <li><Link href="/kapcsolat" className="hover:text-primary">Kapcsolat</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">Hírlevél</h3>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} BacklineIT. Minden jog fenntartva.</p>
                    <div className="flex gap-6">
                        <Link href="/adatvedelem" className="hover:text-primary">Adatvédelem</Link>
                        <Link href="/aszf" className="hover:text-primary">ÁSZF</Link>
                        <Link href="/impresszum" className="hover:text-primary">Impresszum</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
