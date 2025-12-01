import { Users, CheckCircle, Trophy, Clock } from "lucide-react"

const stats = [
    { label: "Sikeres projekt", value: "150+", icon: CheckCircle },
    { label: "Elégedett ügyfél", value: "80+", icon: Users },
    { label: "Év tapasztalat", value: "10+", icon: Trophy },
    { label: "Megspórolt óra", value: "5000+", icon: Clock },
]

export function TrustSection() {
    return (
        <section className="py-12 border-y bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-4">
                            <div className="mb-3 p-3 rounded-full bg-secondary/10 text-secondary">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
