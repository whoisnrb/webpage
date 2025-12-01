import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
            <Card className="w-full max-w-md glass border-0 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center glow-text text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Regisztráció
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Hozz létre egy új fiókot
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RegisterForm />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <div>
                        Már van fiókod?{" "}
                        <Link href="/login" className="text-primary hover:text-accent transition-colors hover:underline">
                            Bejelentkezés
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
