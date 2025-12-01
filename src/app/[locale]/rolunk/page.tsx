import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Heart, Rocket, Code, Database, Layout } from "lucide-react"
import { Link } from "@/i18n/routing"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const team = [
    {
        name: "Kovács Péter",
        role: "Lead Developer & CEO",
        bio: "10+ év tapasztalat full-stack fejlesztésben. A tiszta kód és a skálázható architektúrák híve.",
        icon: Code
    },
    {
        name: "Nagy Anna",
        role: "UI/UX Designer",
        bio: "Szenvedélye a felhasználóbarát és esztétikus felületek tervezése. Pixel-perfect szemléletmód.",
        icon: Layout
    },
    {
        name: "Szabó Gábor",
        role: "DevOps Engineer",
        bio: "A CI/CD folyamatok és a felhő alapú infrastruktúrák szakértője. Mindent automatizál, amit lehet.",
        icon: Database
    }
]

export default function RolunkPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <section className="bg-muted/30 py-16 md:py-24 border-b">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            A technológia megszállottjai,<br />
                            <span className="text-primary">az üzleti siker elkötelezettjei</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Célunk, hogy modern digitális megoldásokkal segítsük a vállalkozásokat a növekedésben és a hatékonyság növelésében.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <SlideUp>
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Küldetésünk</h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Hiszünk abban, hogy az automatizáció és a modern szoftverfejlesztés nem csak a nagyvállalatok kiváltsága. Azért dolgozunk, hogy ezeket az eszközöket elérhetővé tegyük a KKV szektor számára is.
                                </p>
                                <p className="text-lg text-muted-foreground">
                                    Nem csak kódot írunk, hanem problémákat oldunk meg. Minden projektünket üzleti szemlélettel közelítjük meg, keresve a leggyorsabb megtérülést hozó megoldásokat.
                                </p>
                            </div>
                        </SlideUp>
                        <div className="grid grid-cols-2 gap-6">
                            <ScaleIn delay={0.1}>
                                <Card className="bg-primary/5 border-none h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Target className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">Eredményorientáltság</h3>
                                        <p className="text-sm text-muted-foreground">Mérhető üzleti eredményekre törekszünk.</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.2}>
                                <Card className="bg-primary/5 border-none h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Heart className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">Ügyfélközpontúság</h3>
                                        <p className="text-sm text-muted-foreground">Hosszú távú partnerségekben hiszünk.</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.3}>
                                <Card className="bg-primary/5 border-none h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Rocket className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">Innováció</h3>
                                        <p className="text-sm text-muted-foreground">Folyamatosan tanulunk és fejlődünk.</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                            <ScaleIn delay={0.4}>
                                <Card className="bg-primary/5 border-none h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                        <Users className="h-10 w-10 text-primary mb-4" />
                                        <h3 className="font-semibold mb-2">Csapatmunka</h3>
                                        <p className="text-sm text-muted-foreground">Együtt többre vagyunk képesek.</p>
                                    </CardContent>
                                </Card>
                            </ScaleIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <SlideUp>
                        <h2 className="text-3xl font-bold mb-12">Ismerd meg a csapatot</h2>
                    </SlideUp>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {team.map((member, i) => (
                            <ScaleIn key={i} delay={i * 0.1}>
                                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                        <member.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                    <p className="text-primary text-sm mb-4 font-medium">{member.role}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {member.bio}
                                    </p>
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto px-4">
                    <ScaleIn>
                        <h2 className="text-3xl font-bold mb-6">Dolgozzunk együtt!</h2>
                        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                            Készen állsz arra, hogy a következő szintre emeld vállalkozásodat?
                        </p>
                        <Link href="/kapcsolat">
                            <Button size="lg" variant="secondary" className="text-lg px-8">
                                Kapcsolatfelvétel
                            </Button>
                        </Link>
                    </ScaleIn>
                </div>
            </section>
        </div>
    )
}
