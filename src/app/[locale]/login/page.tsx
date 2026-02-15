import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { LoginForm } from "@/components/auth/login-form"
import { useTranslations } from "next-intl"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function LoginPage() {
    const t = useTranslations("Auth.Login");

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md glass border-0 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center glow-text text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        {t("title")}
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        {t("subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <div>
                        {t("no_account")}{" "}
                        <Link href="/register" className="text-primary hover:text-accent transition-colors hover:underline">
                            {t("register_link")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
