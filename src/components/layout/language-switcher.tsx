"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, getPathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const t = useTranslations("LanguageSwitcher")
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const handleLocaleChange = (newLocale: "hu" | "en") => {
        if (typeof document !== "undefined") {
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;
        }

        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            let targetPath = pathname;
            try {
                targetPath = (getPathname as any)({ href: pathname, locale: newLocale });
            } catch {
                targetPath = pathname;
            }

            if (newLocale === "en" && host.endsWith("backlineit.hu")) {
                window.location.href = `https://backlineit.com${targetPath}`;
                return;
            }
            if (newLocale === "hu" && host.endsWith("backlineit.com")) {
                window.location.href = `https://backlineit.hu${targetPath}`;
                return;
            }
        }

        router.replace(pathname as any, { locale: newLocale })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative z-50">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">{t("label")}</span>
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
