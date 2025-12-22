"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TrendingUp, Clock, Wallet, BarChart3, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function ROICalculator() {
    const t = useTranslations("ROICalculator")
    const [activeTab, setActiveTab] = React.useState<'automation' | 'webdev'>('automation')

    // Automation state
    const [hours, setHours] = React.useState([10])
    const [rate, setRate] = React.useState([5000])
    const [period, setPeriod] = React.useState([12])

    // Webdev state
    const [traffic, setTraffic] = React.useState([5000])
    const [conv, setConv] = React.useState([1.5])
    const [aov, setAov] = React.useState([15000])

    const automationTotal = hours[0] * 4 * rate[0] * period[0]
    const webdevGrowth = (traffic[0] * (conv[0] * 1.3 / 100) * aov[0]) - (traffic[0] * (conv[0] / 100) * aov[0])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: t('currency') === 'Ft' ? 'HUF' : 'USD',
            maximumFractionDigits: 0
        }).format(val)
    }

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
                    >
                        {t('title')}
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-12 p-1 bg-muted/50 rounded-full w-fit mx-auto border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab('automation')}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-bold transition-all relative z-10",
                                activeTab === 'automation' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {activeTab === 'automation' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {t('tabs.automation')}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('webdev')}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-bold transition-all relative z-10",
                                activeTab === 'webdev' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {activeTab === 'webdev' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} />
                                {t('tabs.webdev')}
                            </div>
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Inputs */}
                        <Card className="lg:col-span-3 border-primary/10 bg-card/50 backdrop-blur-xl shadow-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    {activeTab === 'automation' ? <TrendingUp className="text-primary" /> : <BarChart3 className="text-primary" />}
                                    {activeTab === 'automation' ? t('tabs.automation') : t('tabs.webdev')}
                                </CardTitle>
                                <CardDescription>Adjust the sliders to match your current business metrics.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-10">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'automation' ? (
                                        <motion.div
                                            key="auto"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-8"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('automation.hours_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{hours[0]}h</span>
                                                </div>
                                                <Slider value={hours} onValueChange={setHours} max={100} step={1} className="py-4" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('automation.rate_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{formatCurrency(rate[0])}</span>
                                                </div>
                                                <Slider value={rate} onValueChange={setRate} max={50000} step={500} className="py-4" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('automation.period_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{period[0]} {t('month')}</span>
                                                </div>
                                                <Slider value={period} onValueChange={setPeriod} max={36} min={1} step={1} className="py-4" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="web"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-8"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('webdev.traffic_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{traffic[0].toLocaleString()}</span>
                                                </div>
                                                <Slider value={traffic} onValueChange={setTraffic} max={100000} step={1000} className="py-4" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('webdev.conv_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{conv[0]}%</span>
                                                </div>
                                                <Slider value={conv} onValueChange={setConv} max={10} step={0.1} className="py-4" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-bold">{t('webdev.aov_label')}</Label>
                                                    <span className="text-primary font-black text-xl">{formatCurrency(aov[0])}</span>
                                                </div>
                                                <Slider value={aov} onValueChange={setAov} max={100000} step={1000} className="py-4" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>

                        {/* Result Display */}
                        <Card className="lg:col-span-2 bg-primary text-primary-foreground border-none overflow-hidden relative shadow-2xl flex flex-col justify-center text-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-3xl -ml-16 -mb-16" />

                            <CardHeader className="relative z-10">
                                <div className="mx-auto bg-white/20 p-4 rounded-2xl w-fit mb-4">
                                    <Wallet size={32} />
                                </div>
                                <CardTitle className="text-xl opacity-80 uppercase tracking-widest font-black">
                                    {activeTab === 'automation' ? t('automation.result_title') : t('webdev.result_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <motion.div
                                    className="text-4xl md:text-5xl font-black mb-4"
                                    key={activeTab === 'automation' ? automationTotal : webdevGrowth}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {formatCurrency(activeTab === 'automation' ? automationTotal : webdevGrowth)}
                                </motion.div>
                                <p className="text-sm opacity-60 flex items-center justify-center gap-1 italic">
                                    <Info size={14} />
                                    {activeTab === 'automation' ? t('automation.disclaimer') : t('webdev.disclaimer')}
                                </p>
                            </CardContent>
                            <div className="p-6 mt-auto">
                                <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                    <div className="text-xs uppercase tracking-tighter opacity-70 mb-1">Efficiency Boost</div>
                                    <div className="text-2xl font-black">{activeTab === 'automation' ? "+250%" : "+30%"}</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
