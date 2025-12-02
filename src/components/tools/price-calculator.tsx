"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Server, Monitor, ShieldCheck } from "lucide-react"

export function PriceCalculator() {
    const [workstations, setWorkstations] = useState([10])
    const [servers, setServers] = useState([1])
    const [slaLevel, setSlaLevel] = useState("basic")
    const [estimatedPrice, setEstimatedPrice] = useState(0)

    // Pricing Constants (HUF)
    const BASE_FEE = 50000
    const PRICE_PER_WORKSTATION = 5000
    const PRICE_PER_SERVER = 25000

    const SLA_MULTIPLIERS: Record<string, number> = {
        basic: 1,
        pro: 1.5,
        enterprise: 2.5
    }

    useEffect(() => {
        const workstationCost = workstations[0] * PRICE_PER_WORKSTATION
        const serverCost = servers[0] * PRICE_PER_SERVER
        const subtotal = BASE_FEE + workstationCost + serverCost
        const total = subtotal * SLA_MULTIPLIERS[slaLevel]

        setEstimatedPrice(Math.round(total / 1000) * 1000) // Round to nearest 1000
    }, [workstations, servers, slaLevel])

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden border-2 border-primary/10 shadow-xl">
            <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8 space-y-8">
                    <div>
                        <CardTitle className="text-2xl mb-2">Árkalkulátor</CardTitle>
                        <CardDescription>
                            Becsüld meg havi rendszerüzemeltetési költségeidet.
                        </CardDescription>
                    </div>

                    <div className="space-y-6">
                        {/* Workstations Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="flex items-center gap-2">
                                    <Monitor className="h-4 w-4 text-primary" />
                                    Munkaállomások száma
                                </Label>
                                <span className="font-bold text-lg">{workstations[0]} db</span>
                            </div>
                            <Slider
                                value={workstations}
                                onValueChange={setWorkstations}
                                max={100}
                                min={1}
                                step={1}
                                className="py-2"
                            />
                        </div>

                        {/* Servers Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="flex items-center gap-2">
                                    <Server className="h-4 w-4 text-primary" />
                                    Szerverek száma
                                </Label>
                                <span className="font-bold text-lg">{servers[0]} db</span>
                            </div>
                            <Slider
                                value={servers}
                                onValueChange={setServers}
                                max={20}
                                min={0}
                                step={1}
                                className="py-2"
                            />
                        </div>

                        {/* SLA Selection */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Szolgáltatási Szint (SLA)
                            </Label>
                            <Select value={slaLevel} onValueChange={setSlaLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz szintet" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic (Hétköznap 9-17)</SelectItem>
                                    <SelectItem value="pro">Pro (Hétköznap 8-20 + Hétvégi ügyelet)</SelectItem>
                                    <SelectItem value="enterprise">Enterprise (24/7)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/50 p-6 md:p-8 flex flex-col justify-between border-l">
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg">A csomag tartalma:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>Korlátlan távoli segítségnyújtás</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>Proaktív rendszerfelügyelet</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>Vírusvédelem menedzselése</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>Havi rendszerességű karbantartás</span>
                            </li>
                            {slaLevel !== 'basic' && (
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                    <span>Kiemelt rendelkezésre állás</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Becsült havidíj</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-primary">
                                    {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(estimatedPrice)}
                                </span>
                                <span className="text-muted-foreground">/ hó</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" asChild>
                            <Link href="/ajanlatkeres">
                                Ajánlatkérés
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
