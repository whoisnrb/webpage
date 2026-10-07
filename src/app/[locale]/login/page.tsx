import { Link } from "@/i18n/routing"
import { LoginForm } from "@/components/auth/login-form"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import {
    ShieldCheck,
    Lock,
    Zap,
    Ticket,
    BarChart3,
    Server,
} from "lucide-react"

export const metadata: Metadata = {
    title: 'Bejelentkezés | BacklineIT Ügyfélportál',
    description: 'Jelentkezz be a BacklineIT ügyfélrendszerébe és kezeld IT projektjeidet, feladataidat és hibajegyeidet egy helyen.',
    robots: {
        index: false,
        follow: false,
    },
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 relative z-10">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* BAL OLDAL: BEMUTATÓ & ÉRTÉKAJÁNLAT */}
                <div className="lg:col-span-5 space-y-6 text-left">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                        BacklineIT Ügyfélportál
                    </div>

                    {/* Headline */}
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
                            Üdvözlünk újra a{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                                rendszerünkben!
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Lépj be fiókodba a folyamatban lévő fejlesztési projektek, hibajegyek és automatizációs kimutatások eléréséhez.
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Azonnali Projekt Dashboard</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Kövesd nyomon mérföldköveidet, készültségi fokodat és az élesítéseket.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                                <Ticket className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Kiemelt Ügyféltámogatás</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Nyiss hibajegyet vagy kérj új fejlesztést dedikált SLA válaszidővel.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                                <Zap className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Automatizáció & Rendszerek</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Közvetlen hozzáférés folyamataidhoz, webhookjaidhoz és szervereidhez.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges Footer */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-cyan-400" />
                            <span>256-bit SSL</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>GDPR Kompatibilis</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <div className="flex items-center gap-1.5">
                            <Server className="h-3.5 w-3.5 text-blue-400" />
                            <span>99.9% Uptime</span>
                        </div>
                    </div>
                </div>

                {/* JOBB OLDAL: PROFESSZIONÁLIS BEJELENTKEZÉSI KÁRTYA */}
                <div className="lg:col-span-7">
                    <div className="relative overflow-hidden rounded-2xl bg-[#090d1a]/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        {/* Top glowing edge line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

                        {/* Card Header */}
                        <div className="mb-6 space-y-1.5 text-left">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Bejelentkezés
                            </h2>
                            <p className="text-sm text-slate-400">
                                Add meg adataidat az ügyfélfiókod eléréséhez.
                            </p>
                        </div>

                        {/* Interactive Login Form Component */}
                        <LoginForm />

                        {/* Footer link to Register */}
                        <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-400">
                            Nincs még ügyfélfiókod?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                            >
                                Regisztráció &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
