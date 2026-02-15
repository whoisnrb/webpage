import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Heart, Rocket, Code, Database, Layout, TrendingUp } from "lucide-react"
import { Link } from "@/i18n/routing"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function RolunkPage() {
    const t = useTranslations('AboutPage')

    const team = [
        {
            name: t('team_members.peter.name'),
            role: t('team_members.peter.role'),
            bio: t('team_members.peter.bio'),
            icon: Code
        },
        {
            name: t('team_members.anna.name'),
            role: t('team_members.anna.role'),
            bio: t('team_members.anna.bio'),
            icon: Layout
        },
        {
            name: t('team_members.gabor.name'),
            role: t('team_members.gabor.role'),
            bio: t('team_members.gabor.bio'),
            icon: Database
        },
        {
            name: t('team_members.levente.name'),
            role: t('team_members.levente.role'),
            bio: t('team_members.levente.bio'),
            icon: TrendingUp
        }
    ]

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.03)_1px,_transparent_0)] bg-[length:32px_32px] -z-20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Hero */}
            <section className="pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {t('hero_title')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">{t('hero_title_highlight')}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto">
                            {t('hero_desc')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <SlideUp>
                            <div>
                                <h2 className="text-3xl font-bold mb-6">{t('mission_title')}</h2>
                                <p className="text-lg text-muted-foreground/80 mb-6">
                                    {t('mission_desc_1')}
                                </p>
                                <p className="text-lg text-muted-foreground/80">
                                    {t('mission_desc_2')}
                                </p>
                            </div>
                        </SlideUp>
                        <div className="grid grid-cols-2 gap-6">
                            <ScaleIn delay={0.1}>
                                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-colors">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Target className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">{t('values.results.title')}</h3>
                                        <p className="text-sm text-muted-foreground/80">{t('values.results.desc')}</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.2}>
                                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-colors">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Heart className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">{t('values.client.title')}</h3>
                                        <p className="text-sm text-muted-foreground/80">{t('values.client.desc')}</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.3}>
                                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-colors">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Rocket className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">{t('values.innovation.title')}</h3>
                                        <p className="text-sm text-muted-foreground/80">{t('values.innovation.desc')}</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.4}>
                                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-colors">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Users className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">{t('values.teamwork.title')}</h3>
                                        <p className="text-sm text-muted-foreground/80">{t('values.teamwork.desc')}</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <SlideUp>
                        <h2 className="text-3xl font-bold mb-12">{t('team_title')}</h2>
                    </SlideUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {team.map((member, i) => (
                            <ScaleIn key={i} delay={i * 0.1}>
                                <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all h-full flex flex-col items-center group">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                        <member.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                    <p className="text-primary text-sm mb-4 font-medium">{member.role}</p>
                                    <p className="text-muted-foreground/80 text-sm">
                                        {member.bio}
                                    </p>
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Dark Design */}
            <section className="relative py-24 md:py-36 overflow-hidden">
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Holographic card */}
                        <div className="relative">
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-3xl opacity-40 blur-sm animate-gradient-x bg-[length:200%_auto]" />
                            <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-10 md:p-16 border border-white/5 shadow-2xl">
                                {/* Top accent */}
                                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                                <div className="text-center">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 mb-8">
                                        <Users className="h-4 w-4 text-violet-400" />
                                        <span className="text-sm font-semibold text-violet-300">{t('cta_badge')}</span>
                                    </div>

                                    {/* Headline */}
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                                        {t('cta_title')}{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                                            {t('cta_title_highlight')}
                                        </span>
                                    </h2>
                                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                        {t('cta_desc')}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                                        <Link href="/kapcsolat">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold overflow-hidden border-0 w-full sm:w-auto">
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 animate-gradient-x bg-[length:200%_auto]" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x bg-[length:200%_auto]" />
                                                <div className="absolute inset-0 shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-shadow duration-300" />
                                                <span className="relative flex items-center text-white font-bold">
                                                    {t('cta_contact')}
                                                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </Button>
                                        </Link>
                                        <Link href="/ajanlatkeres">
                                            <Button size="lg" className="group relative h-16 px-12 text-lg font-bold bg-transparent overflow-hidden w-full sm:w-auto">
                                                <div className="absolute inset-0 rounded-md border-2 border-slate-600 group-hover:border-violet-500/50 transition-colors duration-300" />
                                                <div className="absolute inset-0 bg-white/5 group-hover:bg-violet-500/10 transition-colors duration-300" />
                                                <span className="relative text-white">
                                                    {t('cta_quote')}
                                                </span>
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-4 gap-6 pt-10 border-t border-slate-800">
                                        <div className="text-center">
                                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-1">10+</div>
                                            <div className="text-xs text-slate-500">{useTranslations('HomePage')('stats_exp_title')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1">50+</div>
                                            <div className="text-xs text-slate-500">{useTranslations('HomePage')('stats_projects_title')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-1">100%</div>
                                            <div className="text-xs text-slate-500">{useTranslations('HomePage')('stats_satisfaction_title')}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1">24h</div>
                                            <div className="text-xs text-slate-500">{useTranslations('ServiceTemplate')('fast_response')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom accent */}
                                <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>{t('trust_signals.partner')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{t('trust_signals.personal')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>{t('trust_signals.fast')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
