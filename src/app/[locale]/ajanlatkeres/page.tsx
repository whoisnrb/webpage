"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Send, Sparkles, Rocket, Code, Smartphone, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function QuoteRequestPage() {
    const t = useTranslations("QuoteRequest");
    const [step, setStep] = useState(1)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        projectType: "",
        budget: "",
        description: "",
        deadline: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        setSubmitted(true)
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-900">{t("success_title")}</h2>
                            <p className="text-green-800">
                                {t("success_desc")}
                            </p>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => window.location.href = '/'}>
                                {t("back_home")}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            {t("title")}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Progress / Info Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    {t("sidebar.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Rocket className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t("sidebar.feature_1_title")}</h3>
                                        <p className="text-sm opacity-90">{t("sidebar.feature_1_desc")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Code className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t("sidebar.feature_2_title")}</h3>
                                        <p className="text-sm opacity-90">{t("sidebar.feature_2_desc")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Smartphone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t("sidebar.feature_3_title")}</h3>
                                        <p className="text-sm opacity-90">{t("sidebar.feature_3_desc")}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="hidden md:block">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>1</div>
                                <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>{t("sidebar.step_1")}</span>
                            </div>
                            <div className="w-0.5 h-8 bg-muted-foreground/20 ml-4 mb-4"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>2</div>
                                <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>{t("sidebar.step_2")}</span>
                            </div>
                            <div className="w-0.5 h-8 bg-muted-foreground/20 ml-4 mb-4"></div>
                            <div className="flex items-center gap-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>3</div>
                                <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>{t("sidebar.step_3")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-2">
                        <Card className="border-t-4 border-t-primary shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    {step === 1 && t("steps.1_title")}
                                    {step === 2 && t("steps.2_title")}
                                    {step === 3 && t("steps.3_title")}
                                </CardTitle>
                                <CardDescription>
                                    {step === 1 && t("steps.1_desc")}
                                    {step === 2 && t("steps.2_desc")}
                                    {step === 3 && t("steps.3_desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    {step === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">{t("form.name")}</Label>
                                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder={t("form.name_placeholder")} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">{t("form.email")}</Label>
                                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder={t("form.email_placeholder")} required />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">{t("form.phone")}</Label>
                                                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t("form.phone_placeholder")} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="company">{t("form.company")}</Label>
                                                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder={t("form.company_placeholder")} />
                                                </div>
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <Button type="button" onClick={nextStep} disabled={!formData.name || !formData.email}>
                                                    {t("form.next")} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <Label htmlFor="projectType">{t("form.project_type")}</Label>
                                                <Select onValueChange={(v) => handleSelectChange("projectType", v)} value={formData.projectType}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("form.select_type")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="web">{t("form.types.web")}</SelectItem>
                                                        <SelectItem value="shop">{t("form.types.shop")}</SelectItem>
                                                        <SelectItem value="app">{t("form.types.app")}</SelectItem>
                                                        <SelectItem value="marketing">{t("form.types.marketing")}</SelectItem>
                                                        <SelectItem value="design">{t("form.types.design")}</SelectItem>
                                                        <SelectItem value="other">{t("form.types.other")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="budget">{t("form.budget")}</Label>
                                                <Select onValueChange={(v) => handleSelectChange("budget", v)} value={formData.budget}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("form.select_budget")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="small">{t("form.budgets.small")}</SelectItem>
                                                        <SelectItem value="medium">{t("form.budgets.medium")}</SelectItem>
                                                        <SelectItem value="large">{t("form.budgets.large")}</SelectItem>
                                                        <SelectItem value="enterprise">{t("form.budgets.enterprise")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">{t("form.description")}</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder={t("form.description_placeholder")}
                                                    className="min-h-[150px]"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-4 flex justify-between">
                                                <Button type="button" variant="outline" onClick={prevStep}>
                                                    {t("form.back")}
                                                </Button>
                                                <Button type="button" onClick={nextStep} disabled={!formData.projectType || !formData.description}>
                                                    {t("form.next")} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">{t("form.summary_labels.name")}</span>
                                                    <span className="col-span-2 font-medium">{formData.name}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">{t("form.summary_labels.email")}</span>
                                                    <span className="col-span-2 font-medium">{formData.email}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">{t("form.summary_labels.project")}</span>
                                                    <span className="col-span-2 font-medium capitalize">
                                                        {formData.projectType ? t(`form.types.${formData.projectType}` as any) : ''}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">{t("form.summary_labels.budget")}</span>
                                                    <span className="col-span-2 font-medium capitalize">
                                                        {formData.budget ? t(`form.budgets.${formData.budget}` as any) : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                                                <p>{t("form.privacy_disclaimer")}</p>
                                            </div>

                                            <div className="pt-4 flex justify-between">
                                                <Button type="button" variant="outline" onClick={prevStep}>
                                                    {t("form.back")}
                                                </Button>
                                                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                                                    {loading ? (
                                                        <>{t("form.processing")}</>
                                                    ) : (
                                                        <>
                                                            {t("form.submit")} <Send className="ml-2 h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
