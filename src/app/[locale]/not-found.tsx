import { Link } from "@/i18n/routing"
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, Search } from 'lucide-react'
import { FadeIn } from "@/components/ui/motion-wrapper"

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />

            <FadeIn>
                <div className="bg-muted/30 p-8 rounded-full mb-8 inline-block ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
                    <FileQuestion className="h-20 w-20 text-primary animate-pulse" />
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                    Hoppá! Ez az oldal elveszett az űrben. 🚀
                </h2>

                <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                    Úgy tűnik, olyan helyre tévedtél, ami nem létezik, vagy már áthelyeztük. Ne aggódj, segítünk visszatalálni!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Vissza a főoldalra
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="gap-2">
                        <Link href="/szolgaltatasok">
                            <Search className="h-4 w-4" />
                            Szolgáltatások
                        </Link>
                    </Button>
                </div>
            </FadeIn>
        </div>
    )
}
