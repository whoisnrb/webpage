"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingBag, Key, Ticket, Settings, LogOut, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

const sidebarItems = [
    { name: "Áttekintés", href: "/dashboard", icon: LayoutDashboard },
    { name: "Támogatás", href: "/dashboard/tickets", icon: Ticket },
    { name: "Beállítások", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className="flex h-full flex-col border-r bg-muted/10">
            <div className="p-6">
                <h2 className="text-lg font-bold tracking-tight">Ügyfélportál</h2>
            </div>
            <div className="flex-1 px-4 py-2">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}

                    {session?.user?.role === "ADMIN" && (
                        <>
                            <div className="my-4 border-t border-border/50" />
                            <Link
                                href="/admin/tickets"
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-500",
                                    pathname.startsWith("/admin") ? "bg-red-500/10 text-red-500" : "text-muted-foreground"
                                )}
                            >
                                <ShieldAlert className="h-4 w-4" />
                                Adminisztráció
                            </Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" asChild>
                    <Link href="/login">
                        <LogOut className="mr-2 h-4 w-4" />
                        Kijelentkezés
                    </Link>
                </Button>
            </div>
        </div>
    )
}
