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
    ]

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{t("services")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/szolgaltatasok"
                                    >
                                        <Code2 className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            {t("our_services")}
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
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
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{t("products")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            <ListItem href="/termekek" title={t("all_products")}>
                                {t("all_products_desc")}
                            </ListItem>
                            <ListItem href="/termekek?category=scripts" title={t("scripts")}>
                                {t("scripts_desc")}
                            </ListItem>
                            <ListItem href="/termekek?category=web" title={t("web")}>
                                {t("web_desc")}
                            </ListItem>
                            <ListItem href="/arak" title={t("prices")}>
                                {t("prices_desc")}
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{t("knowledge")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            <ListItem href="/referenciak" title={t("references")}>
                                {t("references_desc")}
                            </ListItem>
                            <ListItem href="/blog" title={t("blog")}>
                                {t("blog_desc")}
                            </ListItem>
                            <ListItem href="/velemeny" title={t("reviews")}>
                                {t("reviews_desc")}
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/kapcsolat" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {t("contact")}
                        </NavigationMenuLink>
                    </Link>
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
