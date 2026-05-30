"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { 
    Code2, 
    Server, 
    Terminal, 
    Globe, 
    Network, 
    Puzzle, 
    LayoutGrid, 
    Layout, 
    Zap, 
    Briefcase, 
    FileText, 
    MessageSquare, 
    CreditCard,
    Activity,
    RefreshCw,
    Cpu,
    Cloud,
    Database,
    Search,
    Headphones
} from "lucide-react"
import { useTranslations } from "next-intl"
import { NeuralBackground } from "@/components/neural-background"

export function MegaMenu() {
    const t = useTranslations("MegaMenu")

    const services: { 
        title: string; 
        href: React.ComponentProps<typeof Link>["href"]; 
        description: string; 
        icon: React.ComponentType<{ className?: string }> 
    }[] = [
        {
            title: t("nav_items.cloud_migration"),
            href: "/szolgaltatasok/felho-migracio-koltsegoptimalizalas",
            description: t("nav_items.cloud_migration_desc"),
            icon: Cloud,
        },
        {
            title: t("nav_items.ai_support"),
            href: "/szolgaltatasok/ai-ugyfelszolgalat-weboldalra",
            description: t("nav_items.ai_support_desc"),
            icon: Cpu,
        },
        {
            title: t("nav_items.crm_auto"),
            href: "/szolgaltatasok/crm-lead-automatizacio",
            description: t("nav_items.crm_auto_desc"),
            icon: Puzzle,
        },
        {
            title: t("nav_items.ecommerce_tracking"),
            href: "/szolgaltatasok/webshop-meres-konverzio-noveles",
            description: t("nav_items.ecommerce_tracking_desc"),
            icon: Activity,
        },
        {
            title: t("nav_items.dashboards"),
            href: "/szolgaltatasok/uzleti-dashboardok-riportok",
            description: t("nav_items.dashboards_desc"),
            icon: Layout,
        },
        {
            title: t("nav_items.remote_helpdesk"),
            href: "/szolgaltatasok/remote-it-helpdesk-ticketing",
            description: t("nav_items.remote_helpdesk_desc"),
            icon: Headphones,
        },
        {
            title: t("nav_items.wordpress"),
            href: "/szolgaltatasok/wordpress-woocommerce-karbantartas",
            description: t("nav_items.wordpress_desc"),
            icon: RefreshCw,
        },
        {
            title: t("nav_items.webshop_auto"),
            href: "/szolgaltatasok/webshop-automatizacio",
            description: t("nav_items.webshop_auto_desc"),
            icon: Zap,
        },
        {
            title: t("nav_items.it_audit"),
            href: "/szolgaltatasok/kkv-it-audit",
            description: t("nav_items.it_audit_desc"),
            icon: Search,
        },
        {
            title: t("nav_items.managed_it"),
            href: "/szolgaltatasok/havidijas-rendszergazda",
            description: t("nav_items.managed_it_desc"),
            icon: Activity,
        },
        {
            title: t("nav_items.backup"),
            href: "/szolgaltatasok/backup-adatmentes",
            description: t("nav_items.backup_desc"),
            icon: Database,
        },
        {
            title: t("nav_items.office_suite"),
            href: "/szolgaltatasok/microsoft-365-google-workspace",
            description: t("nav_items.office_suite_desc"),
            icon: Cloud,
        },
        {
            title: t("nav_items.ai_auto"),
            href: "/szolgaltatasok/ai-asszisztensek",
            description: t("nav_items.ai_auto_desc"),
            icon: Cpu,
        },
        {
            title: t("nav_items.webdev"),
            href: "/szolgaltatasok/webfejlesztes",
            description: t("nav_items.webdev_desc"),
            icon: Globe,
        },
        {
            title: t("nav_items.scripts"),
            href: "/szolgaltatasok/scriptek",
            description: t("nav_items.scripts_desc"),
            icon: Terminal,
        },
        {
            title: t("nav_items.sysadmin"),
            href: "/szolgaltatasok/rendszeruzemeltetes",
            description: t("nav_items.sysadmin_desc"),
            icon: Server,
        },
        {
            title: t("nav_items.network"),
            href: "/szolgaltatasok/halozat",
            description: t("nav_items.network_desc"),
            icon: Network,
        },
        {
            title: t("nav_items.integrations"),
            href: "/szolgaltatasok/integraciok",
            description: t("nav_items.integrations_desc"),
            icon: Puzzle,
        },
    ]

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("services")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl" style={{ background: "rgba(5, 12, 20, 0.96)", backdropFilter: "blur(18px)", border: "1px solid rgba(0, 255, 255, 0.12)" }}>
                            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
                                <NeuralBackground />
                            </div>
                            <ul className="relative z-10 grid gap-3 p-6 md:w-[700px] lg:w-[900px] md:grid-cols-[200px_1fr_1fr] lg:grid-cols-[250px_1fr_1fr]">
                                <li className="row-span-6 md:row-span-6">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            className="flex h-full w-full select-none flex-col justify-end rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/5 to-transparent p-6 no-underline outline-none focus:shadow-md border border-white/5 group"
                                            href="/demo"
                                        >
                                            <Code2 className="h-8 w-8 text-cyan-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
                                            <div className="mb-2 mt-4 text-[17px] font-black tracking-tighter text-white leading-tight">
                                                {t("need_help_title")}
                                            </div>
                                            <p className="text-[11px] leading-tight text-white/50 font-medium group-hover:text-white/70 transition-colors mb-4 mt-2">
                                                {t("need_help_desc")}
                                            </p>
                                            <div className="mt-2 w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-wider text-center border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-300">
                                                {t("need_help_cta")}
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                {services.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                        icon={component.icon}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("products")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#050810]/95 backdrop-blur-3xl border border-white/10 shadow-2xl">
                            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
                                <NeuralBackground />
                            </div>
                            <ul className="relative z-10 grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                <ListItem href="/megoldasok" title={t("all_products")} icon={LayoutGrid}>
                                    {t("all_products_desc")}
                                </ListItem>
                                <ListItem href={{ pathname: "/megoldasok", query: { category: "scripts" } }} title={t("scripts")} icon={Terminal}>
                                    {t("scripts_desc")}
                                </ListItem>
                                <ListItem href={{ pathname: "/megoldasok", query: { category: "web" } }} title={t("web")} icon={Layout}>
                                    {t("web_desc")}
                                </ListItem>
                                <ListItem href={{ pathname: "/megoldasok", query: { category: "plugins" } }} title={t("plugins")} icon={Zap}>
                                    {t("plugins_desc")}
                                </ListItem>
                            </ul>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("knowledge")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#050810]/95 backdrop-blur-3xl border border-white/10 shadow-2xl">
                            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
                                <NeuralBackground />
                            </div>
                            <ul className="relative z-10 grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                <ListItem href="/referenciak" title={t("references")} icon={Briefcase}>
                                    {t("references_desc")}
                                </ListItem>
                                <ListItem href="/blog" title={t("blog")} icon={FileText}>
                                    {t("blog_desc")}
                                </ListItem>
                                <ListItem href="/velemeny" title={t("reviews")} icon={MessageSquare}>
                                    {t("reviews_desc")}
                                </ListItem>
                                <ListItem href="/arak" title={t("prices")} icon={CreditCard}>
                                    {t("prices_desc")}
                                </ListItem>
                            </ul>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/kapcsolat" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold")}>
                            {t("contact")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link> & { title: string; icon?: React.ComponentType<{ className?: string }> }
>(({ className, title, icon: Icon, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-white/5 group border border-transparent hover:border-white/5",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 mb-1">
                        {Icon && <Icon className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />}
                        <div className="text-sm font-black leading-none text-white/95 group-hover:text-primary transition-colors">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-[13px] leading-snug text-white/60 group-hover:text-white transition-colors font-medium">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
