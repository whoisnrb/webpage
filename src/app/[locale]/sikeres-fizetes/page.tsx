import { getTranslations } from "next-intl/server"
import { CheckCircle2, ArrowRight, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { setRequestLocale } from "next-intl/server"
import { NeuralBackground } from "@/components/neural-background"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "SuccessPage" })

    return {
        title: `${t("title")} | BacklineIT`,
        description: t("description"),
    }
}

export default async function SuccessPage({ params }: Props) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: "SuccessPage" })

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#020617]">
            {/* Premium Background */}
            <div className="absolute inset-0 opacity-40">
                <NeuralBackground />
            </div>
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-2xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <SpotlightCard className="p-8 md:p-14 text-center border border-white/10 bg-[#0A0F1E]/80 backdrop-blur-2xl shadow-2xl rounded-3xl relative overflow-hidden group">
                    {/* Inner glowing border effect */}
                    <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
                    
                    <div className="flex justify-center mb-10 relative">
                        {/* Animated rings around the checkmark */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="h-28 w-28 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 relative z-10 before:absolute before:inset-0 before:rounded-full before:border before:border-emerald-500/20 before:animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]">
                            <CheckCircle2 className="h-14 w-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                        </div>
                        
                        {/* Sparkles */}
                        <Sparkles className="absolute top-0 right-1/3 h-6 w-6 text-emerald-300/50 animate-bounce" />
                        <Sparkles className="absolute bottom-4 left-1/3 h-4 w-4 text-emerald-300/30 animate-pulse delay-150" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 tracking-tight mb-6 drop-shadow-sm">
                        {t("title")}
                    </h1>
                    
                    <p className="text-xl text-emerald-100/60 mb-10 leading-relaxed font-medium">
                        {t("description")}
                    </p>

                    <div className="bg-gradient-to-r from-emerald-500/5 via-white/5 to-transparent border border-emerald-500/10 rounded-2xl p-6 mb-12 flex items-start gap-5 text-left shadow-inner transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex-shrink-0 mt-0.5">
                            <FileText className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-white/90 font-bold mb-1">Elektronikus Számla</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {t("invoice_notice")}
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        asChild 
                        size="lg" 
                        className="h-14 px-10 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <Link href="/dashboard">
                            {t("back_home")}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </SpotlightCard>
            </div>
        </div>
    )
}
