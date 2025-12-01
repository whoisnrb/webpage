import { ServiceLayout } from "@/components/templates/service-layout"
import { UseCases } from "@/components/sections/use-cases"
import { Shield, Lock, Eye, FileSearch, Server, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

const useCases = [
    {
        title: "Biztonsági Audit",
        description: "Meglévő rendszerek átvilágítása és sérülékenységek feltárása.",
        icon: FileSearch,
        example: "Weboldal, szerver és adatbázis beállítások ellenőrzése. Részletes jelentés a hibákról és javítási javaslatok.",
        roi: "Feltört oldal kockázatának minimalizálása"
    },
    {
        title: "Behatolás Tesztelés (Pentest)",
        description: "Szimulált támadások a rendszer gyenge pontjainak megtalálására.",
        icon: AlertTriangle,
        example: "Etikus hacker támadás a webshop ellen, SQL Injection, XSS és egyéb hibák keresése.",
        roi: "Valós biztonsági szint felmérése"
    },
    {
        title: "Szerver Keményítés",
        description: "Szerverek beállítása a maximális biztonság érdekében.",
        icon: Server,
        example: "Felesleges portok lezárása, SSH védelem, Tűzfal konfigurálás, Fail2Ban telepítés.",
        roi: "Automatizált támadások kivédése"
    },
    {
        title: "GDPR Megfelelőség",
        description: "Adatvédelmi előírások technikai megvalósítása.",
        icon: Lock,
        example: "Adatbázis titkosítás, naplózás beállítása, adattörlési folyamatok automatizálása.",
        roi: "Bírságok elkerülése"
    },
    {
        title: "Malware Eltávolítás",
        description: "Feltört weboldalak megtisztítása és helyreállítása.",
        icon: Shield,
        example: "Vírusos WordPress oldal tisztítása, hátsó kapuk (backdoor) keresése és lezárása.",
        roi: "Üzletmenet helyreállítása"
    },
    {
        title: "WAF Beállítás",
        description: "Web Application Firewall védelmi vonal kiépítése.",
        icon: Eye,
        example: "Cloudflare vagy ModSecurity beállítása a rosszindulatú forgalom szűrésére.",
        roi: "DDoS és bot támadások elleni védelem"
    }
]

export default function BiztonsagPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <ServiceLayout
                title="Biztonság & Audit"
                description="Védd meg vállalkozásodat és ügyfeleid adatait. Professzionális biztonsági átvilágítás és védelem kiépítése weboldalakhoz és szerverekhez."
                icon={<Shield className="h-8 w-8" />}
                features={[
                    "Weboldal biztonsági audit",
                    "Sérülékenység vizsgálat (Vulnerability Scanning)",
                    "Szerver hardening (biztonsági keményítés)",
                    "Tűzfal és WAF beállítás",
                    "Malware keresés és eltávolítás",
                    "GDPR technikai megfelelőség",
                    "SSL/TLS konfiguráció ellenőrzés",
                    "Biztonsági mentési stratégia"
                ]}
                benefits={[
                    {
                        title: "Nyugalom",
                        description: "Tudhatod, hogy a rendszereid védve vannak a leggyakoribb támadások ellen."
                    },
                    {
                        title: "Bizalom",
                        description: "Az ügyfeleid jobban bíznak egy biztonságos, auditált weboldalban."
                    },
                    {
                        title: "Megtakarítás",
                        description: "Egy sikeres támadás helyreállítása sokkal többe kerül, mint a megelőzés."
                    }
                ]}
                techStack={["Kali Linux", "Nmap", "Wireshark", "Metasploit", "Cloudflare", "ModSecurity", "Fail2Ban", "OpenVAS"]}
                pricing="80.000 Ft-tól"
            />

            {/* Use Cases */}
            <UseCases
                title="Szolgáltatásaink"
                description="Így tesszük biztonságosabbá a rendszereidet"
                cases={useCases}
            />

            {/* Pricing Tiers */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Audit Csomagok
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Egyszeri biztonsági átvilágítási csomagok
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Alap Audit</CardTitle>
                                <CardDescription className="text-base">
                                    Kisebb weboldalak, blogok ellenőrzése
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">80.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Automatizált sérülékenység vizsgálat</li>
                                    <li>• SSL/TLS ellenőrzés</li>
                                    <li>• Alapvető szerver beállítások</li>
                                    <li>• WordPress/CMS plugin ellenőrzés</li>
                                    <li>• Rövid összefoglaló jelentés</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Időtartam: 2-3 munkanap
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader>
                                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                                    Népszerű
                                </div>
                                <CardTitle className="text-2xl">Részletes Audit</CardTitle>
                                <CardDescription className="text-base">
                                    Webshopok, üzleti oldalak átvilágítása
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">180.000 Ft</div>
                                    <p className="text-sm text-muted-foreground">egyszeri díj</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Minden az Alap csomagból</li>
                                    <li>• Manuális tesztelés (Pentest alapok)</li>
                                    <li>• Adatbázis jogosultságok ellenőrzése</li>
                                    <li>• Tűzfal szabályok vizsgálata</li>
                                    <li>• Részletes technikai jelentés</li>
                                    <li>• 1 óra konzultáció a javításokról</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Időtartam: 1 hét
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Komplex Védelem</CardTitle>
                                <CardDescription className="text-base">
                                    Egyedi rendszerek, nagy kockázat
                                </CardDescription>
                                <div className="pt-4">
                                    <div className="text-3xl font-bold">Egyedi</div>
                                    <p className="text-sm text-muted-foreground">árajánlat alapján</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li>• Teljes körű Penetration Testing</li>
                                    <li>• Forráskód elemzés</li>
                                    <li>• Social Engineering teszt</li>
                                    <li>• Védelmi rendszerek (WAF) kiépítése</li>
                                    <li>• Incidens kezelési terv készítése</li>
                                    <li>• Oktatás a munkatársaknak</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Időtartam: 2-4 hét
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/checkout?package=custom">
                            <Button size="lg" className="bg-accent hover:bg-accent/90">
                                Biztonsági audit kérése
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
