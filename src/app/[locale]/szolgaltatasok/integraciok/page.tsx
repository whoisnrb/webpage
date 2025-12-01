import { ServiceLayout } from "@/components/templates/service-layout"
import { Network, Database, Globe, Lock, RefreshCw, Zap } from "lucide-react"

export default function IntegraciokPage() {
    return (
        <ServiceLayout
            title="Integrációk & API"
            description="Kössük össze rendszereidet! Automatizált adatmozgatás, egyedi API fejlesztés és rendszerintegráció a hatékonyabb működésért."
            icon={<Network className="h-8 w-8" />}
            features={[
                "Egyedi API fejlesztés (REST, GraphQL)",
                "Webshop és ERP összekötés",
                "CRM rendszer integrációk",
                "Fizetési kapu implementáció (Stripe, SimplePay)",
                "Adatmigráció és szinkronizáció",
                "Legacy rendszerek modernizálása"
            ]}
            benefits={[
                {
                    title: "Automatizált folyamatok",
                    description: "Nincs több manuális adatbevitel. A rendszereid automatikusan kommunikálnak egymással."
                },
                {
                    title: "Valós idejű adatok",
                    description: "Minden rendszerben mindig az aktuális adatok látszanak, késleltetés nélkül."
                },
                {
                    title: "Kevesebb hiba",
                    description: "Az emberi hibák kiküszöbölése az automatizált adatátvitel révén."
                },
                {
                    title: "Skálázhatóság",
                    description: "Rendszereid képesek lesznek kezelni a növekvő forgalmat és adatmennyiséget."
                }
            ]}
            techStack={[
                "Node.js", "Python", "GraphQL", "REST", "Redis", "RabbitMQ", "PostgreSQL", "Docker"
            ]}
            pricing="Egyedi árazás"
        >
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Gyakori Integrációs Forgatókönyvek</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Webshop ↔ Számlázó</h3>
                            <p className="text-muted-foreground">
                                Automatikus számlakiállítás rendeléskor. Összekötjük WooCommerce vagy Shopify boltodat a Számlázz.hu vagy Billingo fiókoddal.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">CRM ↔ Marketing</h3>
                            <p className="text-muted-foreground">
                                Ügyféladatok szinkronizálása a CRM rendszered (pl. HubSpot, Salesforce) és a hírlevélküldőd (pl. Mailchimp) között.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">ERP ↔ Készletkezelő</h3>
                            <p className="text-muted-foreground">
                                Valós idejű készletfrissítés minden értékesítési csatornán. Ha eladsz valamit a boltban, a webshopon is frissül a készlet.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceLayout>
    )
}
