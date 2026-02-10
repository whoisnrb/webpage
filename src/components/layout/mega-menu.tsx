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
import { Code2, Server, ShoppingCart, FileText, Users, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"

export function MegaMenu() {
    const t = useTranslations("MegaMenu")

    const components: { title: string; href: string; description: string }[] = [
        {
            title: t("nav_items.scripts"),
            href: "/szolgaltatasok/scriptek",
            description: t("nav_items.scripts_desc"),
        },
        {
            title: t("nav_items.webdev"),
            href: "/szolgaltatasok/webfejlesztes",
            description: t("nav_items.webdev_desc"),
        },
        {
            title: t("nav_items.sysadmin"),
            href: "/szolgaltatasok/rendszeruzemeltetes",
            description: t("nav_items.sysadmin_desc"),
        },
        {
            title: t("nav_items.network"),
            href: "/szolgaltatasok/halozat",
            description: t("nav_items.network_desc"),
        },
        {
            title: t("nav_items.integrations"),
            href: "/szolgaltatasok/integraciok",
            description: t("nav_items.integrations_desc"),
        },
    ]

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("services")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-[#050810]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-3xl">
                            <li className="row-span-5">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 no-underline outline-none focus:shadow-md border border-white/5 group"
                                        href="/szolgaltatasok"
                                    >
                                        <Code2 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                                        <div className="mb-2 mt-4 text-xl font-black tracking-tighter text-white">
                                            {t("our_services")}
                                        </div>
                                        <p className="text-sm leading-tight text-white/40 font-medium">
                                            {t("services_desc")}
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                    className="hover:bg-white/5 transition-all rounded-xl"
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("products")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#050810]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-3xl">
                            <ListItem href="/megoldasok" title={t("all_products")} className="hover:bg-white/5 rounded-xl">
                                {t("all_products_desc")}
                            </ListItem>
                            <ListItem href="/megoldasok?category=scripts" title={t("scripts")} className="hover:bg-white/5 rounded-xl">
                                {t("scripts_desc")}
                            </ListItem>
                            <ListItem href="/megoldasok?category=web" title={t("web")} className="hover:bg-white/5 rounded-xl">
                                {t("web_desc")}
                            </ListItem>
                            <ListItem href="/arak" title={t("prices")} className="hover:bg-white/5 rounded-xl">
                                {t("prices_desc")}
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">{t("knowledge")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#050810]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-3xl">
                            <ListItem href="/referenciak" title={t("references")} className="hover:bg-white/5 rounded-xl">
                                {t("references_desc")}
                            </ListItem>
                            <ListItem href="/blog" title={t("blog")} className="hover:bg-white/5 rounded-xl">
                                {t("blog_desc")}
                            </ListItem>
                            <ListItem href="/velemeny" title={t("reviews")} className="hover:bg-white/5 rounded-xl">
                                {t("reviews_desc")}
                            </ListItem>
                        </ul>
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
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-white/5 group",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-black leading-none text-white/80 group-hover:text-primary transition-colors">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/40 group-hover:text-white/60 transition-colors font-medium">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
