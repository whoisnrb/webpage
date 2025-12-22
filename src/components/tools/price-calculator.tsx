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
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"

export function PriceCalculator() {
    const t = useTranslations('PriceCalculator')
    const [workstations, setWorkstations] = useState([10])
    const [servers, setServers] = useState([1])
    const [slaLevel, setSlaLevel] = useState("basic")
    const BASE_FEE = 49990
    const PRICE_PER_WORKSTATION = 4990
    const PRICE_PER_SERVER = 24990

    const SLA_MULTIPLIERS: Record<string, number> = {
        basic: 1,
        pro: 1.5,
        enterprise: 2.5
    }

    const workstationCost = workstations[0] * PRICE_PER_WORKSTATION
    const serverCost = servers[0] * PRICE_PER_SERVER
    const subtotal = BASE_FEE + workstationCost + serverCost
    const total = subtotal * SLA_MULTIPLIERS[slaLevel]
    // Round to nearest 1000 then subtract 10 to get 990 ending
    const estimatedPrice = (Math.round(total / 1000) * 1000) - 10

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden border-2 border-primary/10 shadow-xl">
            <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8 space-y-8">
                    <div>
                        <CardTitle className="text-2xl mb-2">{t('title')}</CardTitle>
                        <CardDescription>
                            {t('description')}
                        </CardDescription>
                    </div>

                    <div className="space-y-6">
                        {/* Workstations Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="flex items-center gap-2">
                                    <Monitor className="h-4 w-4 text-primary" />
                                    {t('workstations_label')}
                                </Label>
                                <span className="font-bold text-lg">{workstations[0]} {t('unit_count')}</span>
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
                                    {t('servers_label')}
                                </Label>
                                <span className="font-bold text-lg">{servers[0]} {t('unit_count')}</span>
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
                                {t('sla_label')}
                            </Label>
                            <Select value={slaLevel} onValueChange={setSlaLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('sla_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">{t('sla_basic')}</SelectItem>
                                    <SelectItem value="pro">{t('sla_pro')}</SelectItem>
                                    <SelectItem value="enterprise">{t('sla_enterprise')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/50 p-6 md:p-8 flex flex-col justify-between border-l">
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg">{t('package_includes')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>{t('feature_support')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>{t('feature_monitoring')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>{t('feature_antivirus')}</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <span>{t('feature_maintenance')}</span>
                            </li>
                            {slaLevel !== 'basic' && (
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                    <span>{t('feature_availability')}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t('estimated_price')}</p>
                            <div className="flex items-baseline gap-1">
                                <PriceDisplay amount={estimatedPrice} className="text-4xl text-primary" />
                                <span className="text-muted-foreground">{t('per_month')}</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" asChild>
                            <Link href="/ajanlatkeres">
                                {t('request_quote')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
