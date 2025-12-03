"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie, X, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Consent = {
    essential: boolean
    analytics: boolean
    marketing: boolean
}

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [consent, setConsent] = useState<Consent>({
        essential: true,
        analytics: true,
        marketing: true,
    })

    useEffect(() => {
        const savedConsent = localStorage.getItem("cookie-consent")
        if (!savedConsent) {
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const saveConsent = (newConsent: Consent) => {
        localStorage.setItem("cookie-consent", JSON.stringify(newConsent))
        setIsVisible(false)
        setShowSettings(false)
        // Here you would trigger/block scripts based on consent
        if (newConsent.analytics) {
            // Enable analytics
        }
    }

    const handleAcceptAll = () => {
        saveConsent({ essential: true, analytics: true, marketing: true })
    }

    const handleDeclineAll = () => {
        saveConsent({ essential: true, analytics: false, marketing: false })
    }

    const handleSaveSettings = () => {
        saveConsent(consent)
    }

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-[400px]"
                    >
                        <Card className="p-4 shadow-xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Cookie className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-semibold leading-none tracking-tight">Sütiket használunk 🍪</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Az oldal működéséhez és a felhasználói élmény javításához sütiket használunk.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                                        Beállítások
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDeclineAll}>
                                        Elutasít
                                    </Button>
                                    <Button size="sm" onClick={handleAcceptAll}>
                                        Elfogad
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Süti beállítások</DialogTitle>
                        <DialogDescription>
                            Itt testreszabhatod, hogy milyen sütiket engedélyezel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="essential" className="font-medium">Szükséges sütik</Label>
                                <span className="text-xs text-muted-foreground">Az oldal működéséhez elengedhetetlenek.</span>
                            </div>
                            <Switch id="essential" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="analytics" className="font-medium">Analitika</Label>
                                <span className="text-xs text-muted-foreground">Segítenek megérteni, hogyan használják a látogatók az oldalt.</span>
                            </div>
                            <Switch
                                id="analytics"
                                checked={consent.analytics}
                                onCheckedChange={(checked) => setConsent({ ...consent, analytics: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="marketing" className="font-medium">Marketing</Label>
                                <span className="text-xs text-muted-foreground">Releváns hirdetések megjelenítéséhez.</span>
                            </div>
                            <Switch
                                id="marketing"
                                checked={consent.marketing}
                                onCheckedChange={(checked) => setConsent({ ...consent, marketing: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSettings(false)}>Mégse</Button>
                        <Button onClick={handleSaveSettings}>Mentés</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
