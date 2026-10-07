import { Link } from "@/i18n/routing"
import { LoginForm } from "@/components/auth/login-form"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth.Login' });

    return {
        title: t('meta_title'),
        description: t('meta_description'),
        robots: {
            index: false,
            follow: false,
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function LoginPage() {
    const tPortal = useTranslations("Auth.Portal");
    const tLogin = useTranslations("Auth.Login");

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
                        {tPortal("badge")}
                    </div>

                    {/* Headline */}
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
                            {tPortal("login_headline_start")}
                            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                                {tPortal("login_headline_gradient")}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            {tPortal("login_desc")}
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">{tPortal("login_benefit1_title")}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {tPortal("login_benefit1_desc")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">
                                <Ticket className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">{tPortal("login_benefit2_title")}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {tPortal("login_benefit2_desc")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                                <Zap className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">{tPortal("login_benefit3_title")}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {tPortal("login_benefit3_desc")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges Footer */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-cyan-400" />
                            <span>{tPortal("ssl")}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{tPortal("gdpr")}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <div className="flex items-center gap-1.5">
                            <Server className="h-3.5 w-3.5 text-blue-400" />
                            <span>{tPortal("uptime")}</span>
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
                                {tLogin("title")}
                            </h2>
                            <p className="text-sm text-slate-400">
                                {tLogin("subtitle")}
                            </p>
                        </div>

                        {/* Interactive Login Form Component */}
                        <LoginForm />

                        {/* Footer link to Register */}
                        <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-400">
                            {tLogin("no_account")}{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                            >
                                {tLogin("register_link")}
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
