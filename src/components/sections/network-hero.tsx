"use client"

import { Suspense, lazy } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Shield, Wifi, Lock, Network } from 'lucide-react'
import { NeuralNetworkBackground } from '@/components/ui/neural-network-background'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import DecryptedText from '@/components/ui/decrypted-text'

// Lazy load the 3D component for better performance
const NetworkVisualization = lazy(() =>
    import('@/components/3d/NetworkVisualization').then(mod => ({ default: mod.NetworkVisualization }))
)

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl">
            <div className="text-center">
                <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-white/60 text-sm font-medium">Loading 3D Network...</p>
            </div>
        </div>
    )
}

export function NetworkHero() {
    const t = useTranslations('Services.Network')

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Effects */}
            <NeuralNetworkBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: 3D Visualization */}
                    <div className="order-2 lg:order-1">
                        <div className="relative aspect-square w-full max-w-2xl mx-auto lg:mx-0">
                            <Suspense fallback={<LoadingFallback />}>
                                <NetworkVisualization />
                            </Suspense>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2 space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10">
                            <Network className="h-3 w-3" />
                            NETWORK SOLUTIONS
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                            Professzionális<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary">
                                <DecryptedText
                                    text="Hálózati Megoldások"
                                    animateOn="view"
                                    speed={100}
                                    className="inline-block"
                                />
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            Biztonságos távoli elérés, hálózati szegmentálás és tűzfal menedzsment vállalati szinten.
                            Építsünk együtt egy megbízható és skálázható hálózati infrastruktúrát.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Lock, text: 'VPN Megoldások' },
                                { icon: Network, text: 'VLAN Szegmentálás' },
                                { icon: Shield, text: 'Tűzfal Menedzsment' },
                                { icon: Wifi, text: 'WiFi Kezelés' },
                            ].map((feature, i) => (
                                <SpotlightCard key={i} className="p-3 border-white/5 bg-white/5 hover:bg-white/10 transition-colors" spotlightColor="rgba(6, 182, 212, 0.25)">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 bg-primary/5">
                                            <feature.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold tracking-wide">{feature.text}</span>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)]"
                                asChild
                            >
                                <Link href="/kapcsolat">
                                    Ajánlatkérés
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/5 text-white font-bold"
                                asChild
                            >
                                <Link href="/demo">
                                    Ingyenes Konzultáció
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-xs text-white/40 font-medium mb-2">
                                HIVATALOS SZAKKÉPESÍTÉS
                            </p>
                            <p className="text-sm text-white/60 font-bold">
                                Informatikai Rendszer- és Hálózatüzemeltető 🎓
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
