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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Scriptek",
        href: "/szolgaltatasok/scriptek",
        description: "Egyedi fejlesztésű scriptek és bővítmények szerverekhez.",
    },
    {
        title: "Webfejlesztés",
        href: "/szolgaltatasok/webfejlesztes",
        description: "Modern, reszponzív weboldalak és webshopok készítése.",
    },
    {
        title: "Rendszerüzemeltetés",
        href: "/szolgaltatasok/rendszeruzemeltetes",
        description: "Szerverek karbantartása, monitorozása és biztonsági frissítése.",
    },
]

export function MegaMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Szolgáltatások</NavigationMenuTrigger>
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
                                            Szolgáltatásaink
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Fedezd fel teljes kínálatunkat a fejlesztéstől az üzemeltetésig.
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
                    <NavigationMenuTrigger>Termékek</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            <ListItem href="/termekek" title="Összes Termék">
                                Böngéssz a teljes szoftver és script kínálatunkban.
                            </ListItem>
                            <ListItem href="/termekek?category=scripts" title="Scriptek">
                                FiveM és egyéb játékszerver scriptek.
                            </ListItem>
                            <ListItem href="/termekek?category=web" title="Webes Megoldások">
                                Sablonok, pluginok és kész weboldalak.
                            </ListItem>
                            <ListItem href="/arak" title="Árak">
                                Átlátható csomagajánlatok és egyedi árazás.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Tudástár</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            <ListItem href="/referenciak" title="Referenciák">
                                Korábbi munkáink és elégedett ügyfeleink.
                            </ListItem>
                            <ListItem href="/blog" title="Blog">
                                Szakmai cikkek, útmutatók és hírek.
                            </ListItem>
                            <ListItem href="/velemeny" title="Vélemények">
                                Mit mondanak rólunk az ügyfelek?
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/kapcsolat" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Kapcsolat
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
