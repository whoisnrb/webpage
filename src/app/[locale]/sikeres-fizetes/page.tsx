import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { CheckCircle, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { setRequestLocale } from "next-intl/server"

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
        <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            
            <div className="max-w-2xl w-full relative z-10">
                <SpotlightCard className="p-8 md:p-12 text-center border border-white/10 bg-black/40 backdrop-blur-xl">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                            <CheckCircle className="h-24 w-24 text-green-400 relative z-10" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        {t("title")}
                    </h1>
                    
                    <p className="text-xl text-white/70 mb-8 leading-relaxed">
                        {t("description")}
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-start gap-4 text-left">
                        <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <p className="text-white/60 text-sm leading-relaxed">
                            {t("invoice_notice")}
                        </p>
                    </div>
                    
                    <Button 
                        asChild 
                        size="lg" 
                        className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all duration-300 hover:scale-105"
                    >
                        <Link href="/">
                            {t("back_home")}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </SpotlightCard>
            </div>
        </div>
    )
}
