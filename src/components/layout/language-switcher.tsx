"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Nyelv váltása</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLocaleChange("hu")} className={locale === "hu" ? "bg-accent" : ""}>
                    🇭🇺 Magyar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange("en")} className={locale === "en" ? "bg-accent" : ""}>
                    🇬🇧 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
