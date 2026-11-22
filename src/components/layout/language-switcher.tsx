"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

const PATH_MAP_EN_TO_HU: Record<string, string> = {
    '/': '/',
    '/about-us': '/rolunk',
    '/references': '/referenciak',
    '/pricing': '/arak',
    '/contact': '/kapcsolat',
    '/services': '/szolgaltatasok',
    '/services/security': '/szolgaltatasok/biztonsag',
    '/services/network': '/szolgaltatasok/halozat',
    '/services/integrations': '/szolgaltatasok/integraciok',
    '/services/system-administration': '/szolgaltatasok/rendszeruzemeltetes',
    '/services/scripts': '/szolgaltatasok/scriptek',
    '/services/web-development': '/szolgaltatasok/webfejlesztes',
    '/services/wordpress-woocommerce-maintenance': '/szolgaltatasok/wordpress-woocommerce-karbantartas',
    '/services/smb-it-audit': '/szolgaltatasok/kkv-it-audit',
    '/services/webshop-automation': '/szolgaltatasok/webshop-automatizacio',
    '/services/ai-assistants': '/szolgaltatasok/ai-asszisztensek',
    '/services/microsoft-365-google-workspace': '/szolgaltatasok/microsoft-365-google-workspace',
    '/services/backup-data-recovery': '/szolgaltatasok/backup-adatmentes',
    '/services/managed-it-services': '/szolgaltatasok/havidijas-rendszergazda',
    '/services/cloud-migration-cost-optimization': '/szolgaltatasok/felho-migracio-koltsegoptimalizalas',
    '/services/ai-customer-support-chatbot': '/szolgaltatasok/ai-ugyfelszolgalat-weboldalra',
    '/services/crm-lead-automation': '/szolgaltatasok/crm-lead-automatizacio',
    '/services/ecommerce-tracking-conversion-optimization': '/szolgaltatasok/webshop-meres-konverzio-noveles',
    '/services/business-dashboards-automated-reports': '/szolgaltatasok/uzleti-dashboardok-riportok',
    '/services/remote-it-helpdesk-ticketing': '/szolgaltatasok/remote-it-helpdesk-ticketing',
    '/services/continuous-security-monitoring-nis2': '/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2',
    '/services/phishing-simulation-security-training': '/szolgaltatasok/adathalaszat-szimulacio-biztonsagi-oktatas',
    '/services/managed-enterprise-waf-shield': '/szolgaltatasok/menedzselt-enterprise-waf-vedelem',
    '/services/private-enterprise-ai-knowledge-base': '/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag',
    '/services/ai-document-invoice-processing': '/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr',
    '/services/ai-call-meeting-intelligence': '/szolgaltatasok/ai-hivas-es-targyalaselemzo-asszisztens',
    '/services/automated-tender-procurement-monitor': '/szolgaltatasok/automatizalt-palyazat-es-kozbeszerzes-figyelo',
    '/services/ransomware-proof-disaster-recovery-draas': '/szolgaltatasok/zsarolovirus-vedett-katasztrofa-helyreallitas-draas',
    '/services/synthetic-webshop-checkout-monitoring': '/szolgaltatasok/szintetikus-webshop-es-fizetes-monitoring',
    '/services/campaign-load-testing-performance-audit': '/szolgaltatasok/kampany-elotti-terhelesteszteles-load-testing',
    '/services/cloud-virtual-workstations-vdi': '/szolgaltatasok/felhos-virtualis-munkaallomasok-vdi',
    '/services/white-label-encrypted-client-portal': '/szolgaltatasok/white-label-titkositott-ugyfelportal',
    '/services/gdpr-compliant-cookieless-analytics': '/szolgaltatasok/gdpr-kompatibilis-cookie-mentes-webanalitika',
    '/services/company-tax-id-validation-api': '/szolgaltatasok/magyar-adoszam-ceginformacio-validalo-api',
    '/solutions': '/megoldasok',
    '/testimonials': '/velemeny',
    '/blog': '/blog',
    '/consultation': '/konzultacio',
    '/careers': '/karrier',
    '/careers/apply': '/karrier/jelentkezes',
    '/imprint': '/impresszum',
    '/privacy-policy': '/adatvedelem',
    '/terms-and-conditions': '/aszf',
    '/request-a-quote': '/ajanlatkeres',
    '/demo': '/demo',
    '/login': '/login',
    '/register': '/register',
    '/checkout': '/checkout',
    '/dashboard': '/dashboard',
    '/admin': '/admin'
};

const PATH_MAP_HU_TO_EN = Object.fromEntries(
    Object.entries(PATH_MAP_EN_TO_HU).map(([en, hu]) => [hu, en])
);

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
            const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

            if (newLocale === "en" && host.endsWith("backlineit.hu")) {
                const targetPath = PATH_MAP_HU_TO_EN[currentPath] || currentPath;
                window.location.href = `https://backlineit.com${targetPath}`;
                return;
            }
            if (newLocale === "hu" && host.endsWith("backlineit.com")) {
                const targetPath = PATH_MAP_EN_TO_HU[currentPath] || currentPath;
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
                <DropdownMenuItem
                    onSelect={() => handleLocaleChange("hu")}
                    onClick={() => handleLocaleChange("hu")}
                    className={locale === "hu" ? "bg-accent cursor-pointer" : "cursor-pointer"}
                >
                    🇭🇺 Magyar
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => handleLocaleChange("en")}
                    onClick={() => handleLocaleChange("en")}
                    className={locale === "en" ? "bg-accent cursor-pointer" : "cursor-pointer"}
                >
                    🇬🇧 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
