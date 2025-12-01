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

export default function QuoteRequestPage() {
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
                            <h2 className="text-2xl font-bold text-green-900">Köszönjük a megkeresést!</h2>
                            <p className="text-green-800">
                                Sikeresen megkaptuk az ajánlatkérésedet. Kollégáink hamarosan (általában 24 órán belül) felveszik veled a kapcsolatot a megadott elérhetőségeken.
                            </p>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => window.location.href = '/'}>
                                Vissza a főoldalra
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
                            Valósítsuk meg az ötleted!
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Töltsd ki az alábbi űrlapot, és mi elkészítjük a személyre szabott ajánlatodat.
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
                                    Miért válassz minket?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Rocket className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Gyors Megvalósítás</h3>
                                        <p className="text-sm opacity-90">Hatékony folyamatok, tartott határidők.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Code className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Modern Tech</h3>
                                        <p className="text-sm opacity-90">A legújabb technológiákat használjuk.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                                        <Smartphone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Responsive Design</h3>
                                        <p className="text-sm opacity-90">Minden eszközön tökéletes megjelenés.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="hidden md:block">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>1</div>
                                <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Alapadatok</span>
                            </div>
                            <div className="w-0.5 h-8 bg-muted-foreground/20 ml-4 mb-4"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>2</div>
                                <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Projekt részletei</span>
                            </div>
                            <div className="w-0.5 h-8 bg-muted-foreground/20 ml-4 mb-4"></div>
                            <div className="flex items-center gap-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'bg-primary border-primary text-white' : 'border-muted-foreground text-muted-foreground'}`}>3</div>
                                <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>Összegzés</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-2">
                        <Card className="border-t-4 border-t-primary shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    {step === 1 && "Kezdjük az alapokkal"}
                                    {step === 2 && "Mesélj a projektről"}
                                    {step === 3 && "Ellenőrzés és küldés"}
                                </CardTitle>
                                <CardDescription>
                                    {step === 1 && "Add meg az elérhetőségeidet, hogy felvehessük veled a kapcsolatot."}
                                    {step === 2 && "Minél több részletet osztasz meg, annál pontosabb ajánlatot tudunk adni."}
                                    {step === 3 && "Nézd át az adatokat, és ha minden rendben, küldd el az igényedet."}
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
                                                    <Label htmlFor="name">Teljes név *</Label>
                                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Kovács János" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email cím *</Label>
                                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="janos@ceg.hu" required />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Telefonszám</Label>
                                                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+36 30 123 4567" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="company">Cégnév (opcionális)</Label>
                                                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Minta Kft." />
                                                </div>
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <Button type="button" onClick={nextStep} disabled={!formData.name || !formData.email}>
                                                    Tovább <ArrowRight className="ml-2 h-4 w-4" />
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
                                                <Label htmlFor="projectType">Projekt típusa *</Label>
                                                <Select onValueChange={(v) => handleSelectChange("projectType", v)} value={formData.projectType}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Válassz típust" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="web">Weboldal fejlesztés</SelectItem>
                                                        <SelectItem value="shop">Webshop készítés</SelectItem>
                                                        <SelectItem value="app">Egyedi szoftver / App</SelectItem>
                                                        <SelectItem value="marketing">Online Marketing</SelectItem>
                                                        <SelectItem value="design">UI/UX Design</SelectItem>
                                                        <SelectItem value="other">Egyéb</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="budget">Tervezett keretösszeg</Label>
                                                <Select onValueChange={(v) => handleSelectChange("budget", v)} value={formData.budget}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Válassz keretet" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="small">500.000 Ft alatt</SelectItem>
                                                        <SelectItem value="medium">500.000 Ft - 1.500.000 Ft</SelectItem>
                                                        <SelectItem value="large">1.500.000 Ft - 5.000.000 Ft</SelectItem>
                                                        <SelectItem value="enterprise">5.000.000 Ft felett</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Projekt leírása *</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Írd le röviden az elképzelésedet, céljaidat..."
                                                    className="min-h-[150px]"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-4 flex justify-between">
                                                <Button type="button" variant="outline" onClick={prevStep}>
                                                    Vissza
                                                </Button>
                                                <Button type="button" onClick={nextStep} disabled={!formData.projectType || !formData.description}>
                                                    Tovább <ArrowRight className="ml-2 h-4 w-4" />
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
                                                    <span className="text-muted-foreground">Név:</span>
                                                    <span className="col-span-2 font-medium">{formData.name}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">Email:</span>
                                                    <span className="col-span-2 font-medium">{formData.email}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">Projekt:</span>
                                                    <span className="col-span-2 font-medium capitalize">{formData.projectType}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">Keret:</span>
                                                    <span className="col-span-2 font-medium capitalize">{formData.budget}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                                                <p>Az "Ajánlatkérés küldése" gombra kattintva elfogadod az Adatvédelmi tájékoztatónkat.</p>
                                            </div>

                                            <div className="pt-4 flex justify-between">
                                                <Button type="button" variant="outline" onClick={prevStep}>
                                                    Vissza
                                                </Button>
                                                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                                                    {loading ? (
                                                        <>Feldolgozás...</>
                                                    ) : (
                                                        <>
                                                            Ajánlatkérés küldése <Send className="ml-2 h-4 w-4" />
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
