"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Menu, X, Code2, ChevronDown, User, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { CurrencySwitcher } from "@/components/layout/currency-switcher"
import { MegaMenu } from "@/components/layout/mega-menu"
import { SERVICES_STRUCTURE } from "./services-config"
import { DarkModeToggle } from "@/components/theme/dark-mode-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NeuralBackground } from "@/components/neural-background"
import { cn } from "@/lib/utils"



export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = React.useState(false)
    const { data: session, status } = useSession()
    const t = useTranslations("Navigation")
    const tMega = useTranslations("MegaMenu")
    const pathname = usePathname()

    const userName = session?.user?.name || ""
    const userEmail = session?.user?.email || ""
    const initials = userName
        ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : "U"

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        return null;
    }

    const navCategories: {
        name: string;
        href: React.ComponentProps<typeof Link>["href"];
        items: {
            name: string;
            href: React.ComponentProps<typeof Link>["href"];
        }[];
    }[] = [
        {
            name: t("services"),
            href: "/szolgaltatasok",
            items: [
                { name: tMega("nav_items.wordpress"), href: "/szolgaltatasok/wordpress-woocommerce-karbantartas" },
                { name: tMega("nav_items.webshop_auto"), href: "/szolgaltatasok/webshop-automatizacio" },
                { name: tMega("nav_items.it_audit"), href: "/szolgaltatasok/kkv-it-audit" },
                { name: tMega("nav_items.managed_it"), href: "/szolgaltatasok/havidijas-rendszergazda" },
                { name: tMega("nav_items.backup"), href: "/szolgaltatasok/backup-adatmentes" },
                { name: tMega("nav_items.office_suite"), href: "/szolgaltatasok/microsoft-365-google-workspace" },
                { name: tMega("nav_items.ai_auto"), href: "/szolgaltatasok/ai-asszisztensek" },
                { name: tMega("nav_items.webdev"), href: "/szolgaltatasok/webfejlesztes" },
                { name: tMega("nav_items.scripts"), href: "/szolgaltatasok/scriptek" },
                { name: tMega("nav_items.sysadmin"), href: "/szolgaltatasok/rendszeruzemeltetes" },
                { name: tMega("nav_items.network"), href: "/szolgaltatasok/halozat" },
                { name: tMega("nav_items.integrations"), href: "/szolgaltatasok/integraciok" },
            ]
        },
        {
            name: t("products"),
            href: "/megoldasok",
            items: [
                { name: tMega("all_products"), href: "/megoldasok" },
                { name: tMega("scripts"), href: { pathname: "/megoldasok", query: { category: "scripts" } } },
                { name: tMega("web"), href: { pathname: "/megoldasok", query: { category: "web" } } },
                { name: tMega("plugins"), href: { pathname: "/megoldasok", query: { category: "plugins" } } },
            ]
        },
        {
            name: tMega("knowledge"),
            href: "/referenciak",
            items: [
                { name: t("references"), href: "/referenciak" },
                { name: t("pricing"), href: "/arak" },
                { name: t("reviews"), href: "/velemeny" },
                { name: tMega("blog"), href: "/blog" },
            ]
        }
    ]

    const singleLinks: {
        name: string;
        href: React.ComponentProps<typeof Link>["href"];
    }[] = [
        { name: tMega("contact"), href: "/kapcsolat" },
    ]

    return (
        <>
            <header className="sticky top-0 z-[100] w-full bg-background/50 backdrop-blur-3xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold tracking-tight text-primary">
                                <span className="font-bold text-xl tracking-tight">
                                    Backline<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">IT</span>
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <MegaMenu />
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-menu"))}
                            className="text-muted-foreground hover:text-primary"
                        >
                            <span className="sr-only">{t("search")}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </Button>
                        {status === "authenticated" && session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 active:scale-95 transition-all duration-200 text-sm font-medium text-white/90 focus:outline-none cursor-pointer"
                                >
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={userName}
                                            className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-500/30"
                                        />
                                    ) : (
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/20 text-[9px] font-bold text-cyan-400 ring-1 ring-cyan-500/25">
                                            {initials}
                                        </div>
                                    )}
                                    <span className="max-w-[100px] truncate text-white/90 font-semibold">{userName}</span>
                                    <ChevronDown className={cn("h-3.5 w-3.5 text-white/40 transition-transform duration-200", profileMenuOpen && "rotate-180")} />
                                </button>

                                {/* Desktop Dropdown Menu */}
                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <>
                                            {/* Láthatatlan háttér a kattintás bezárásához */}
                                            <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-[#080812]/95 backdrop-blur-2xl p-1.5 shadow-2xl shadow-cyan-500/5 focus:outline-none z-50 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                                                
                                                <div className="px-3 py-2 border-b border-white/5 mb-1.5 relative z-10">
                                                    <p className="text-[10px] text-cyan-400/70 font-black uppercase tracking-widest">{t("client_portal")}</p>
                                                    <p className="text-xs text-white/80 font-bold truncate mt-0.5">{userName}</p>
                                                    <p className="text-[10px] text-white/40 truncate">{userEmail}</p>
                                                </div>
                                                
                                                <div className="space-y-0.5 relative z-10">
                                                    <Link
                                                        href={"/dashboard/settings" as any}
                                                        onClick={() => setProfileMenuOpen(false)}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-cyan-400 pl-3 transition-all cursor-pointer"
                                                    >
                                                        <User className="h-3.5 w-3.5 text-white/40" />
                                                        {t("profile")}
                                                    </Link>
                                                    <Link
                                                        href={"/dashboard" as any}
                                                        onClick={() => setProfileMenuOpen(false)}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-cyan-400 pl-3 transition-all cursor-pointer"
                                                    >
                                                        <LayoutDashboard className="h-3.5 w-3.5 text-white/40" />
                                                        {t("dashboard_menu")}
                                                    </Link>
                                                    <Link
                                                        href={"/dashboard/settings" as any}
                                                        onClick={() => setProfileMenuOpen(false)}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-cyan-400 pl-3 transition-all cursor-pointer"
                                                    >
                                                        <Settings className="h-3.5 w-3.5 text-white/40" />
                                                        {t("settings")}
                                                    </Link>
                                                    <div className="my-1 border-t border-white/5" />
                                                    <button
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);
                                                            signOut({ callbackUrl: "/login" });
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                                                    >
                                                        <LogOut className="h-3.5 w-3.5 text-red-400/80" />
                                                        {t("logout")}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">{t("client_portal")}</Link>
                            </Button>
                        )}
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white" asChild>
                            <Link href="/demo">{t("free_consultation")}</Link>
                        </Button>
                        <DarkModeToggle />
                        <ThemeCustomizer />
                        <CurrencySwitcher />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">{t("open_menu")}</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b bg-[#050810]/95 backdrop-blur-3xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 z-0 opacity-20">
                                <NeuralBackground />
                            </div>
                            <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
                                <nav>
                                     <Accordion type="single" collapsible className="w-full">
                                         {navCategories.map((category) => {
                                             const isServices = category.name === t("services")
                                             return (
                                                 <AccordionItem key={category.name} value={category.name} className="border-white/5">
                                                     <AccordionTrigger className="text-lg font-bold text-white/90 hover:text-primary py-4 hover:no-underline">
                                                         {category.name}
                                                     </AccordionTrigger>
                                                     <AccordionContent>
                                                         {isServices ? (
                                                             <div className="space-y-4">
                                                                 <Accordion type="single" collapsible className="w-full pl-2 space-y-1">
                                                                     {SERVICES_STRUCTURE.map((subCat) => {
                                                                         const subCatName = tMega(subCat.nameKey)
                                                                         const SubIcon = subCat.icon
                                                                         return (
                                                                             <AccordionItem key={subCat.id} value={subCat.id} className="border-white/5">
                                                                                 <AccordionTrigger className="text-sm font-black text-white/80 hover:text-primary py-3 hover:no-underline flex items-center gap-2">
                                                                                     <span className="flex items-center gap-2">
                                                                                         <SubIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                                                                                         {subCatName}
                                                                                     </span>
                                                                                 </AccordionTrigger>
                                                                                 <AccordionContent>
                                                                                     <div className="flex flex-col gap-3 pl-6 pt-2 pb-4 border-l border-white/5 ml-2">
                                                                                         {subCat.items.map((subItem) => {
                                                                                             const subItemName = tMega(`nav_items.${subItem.key}`)
                                                                                             const isActive = pathname === subItem.href
                                                                                             return (
                                                                                                 <Link
                                                                                                     key={subItem.key}
                                                                                                     href={subItem.href as any}
                                                                                                     className={cn(
                                                                                                         "text-xs font-semibold py-1 flex items-center justify-between group transition-colors",
                                                                                                         isActive
                                                                                                             ? "text-primary font-bold"
                                                                                                             : "text-white/40 hover:text-white"
                                                                                                     )}
                                                                                                     onClick={() => setMobileMenuOpen(false)}
                                                                                                 >
                                                                                                     <span>{subItemName}</span>
                                                                                                     {subItem.popular && (
                                                                                                         <span className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full scale-90">
                                                                                                             {tMega("popular")}
                                                                                                         </span>
                                                                                                     )}
                                                                                                 </Link>
                                                                                             )
                                                                                         })}
                                                                                     </div>
                                                                                 </AccordionContent>
                                                                             </AccordionItem>
                                                                         )
                                                                     })}
                                                                 </Accordion>

                                                                 {/* Mobile Services Left Panel CTA Card */}
                                                                 <div className="pt-4 border-t border-white/5">
                                                                     <Link
                                                                         href="/demo"
                                                                         className="flex select-none flex-col justify-end rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent p-5 no-underline border border-cyan-500/20 hover:border-cyan-500/40 shadow-lg group transition-all duration-300"
                                                                         onClick={() => setMobileMenuOpen(false)}
                                                                     >
                                                                         <div className="flex items-center gap-2 text-cyan-400">
                                                                             <span className="text-[10px] font-black uppercase tracking-widest">{tMega("need_help_title")}</span>
                                                                         </div>
                                                                         <p className="text-[11px] leading-relaxed text-white/50 font-medium mt-1 mb-3">
                                                                             {tMega("need_help_desc")}
                                                                         </p>
                                                                         <div className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-wider text-center border border-cyan-500/25 transition-all">
                                                                             {tMega("need_help_cta_long")}
                                                                         </div>
                                                                     </Link>
                                                                 </div>
                                                             </div>
                                                         ) : (
                                                             <div className="flex flex-col gap-3 pl-4 pt-2 pb-4">
                                                                 {category.items.map((item) => {
                                                                     const href = typeof item.href === 'string' ? item.href : (item.href as { pathname: string }).pathname;
                                                                     const isActive = pathname === href;
                                                                     return (
                                                                         <Link
                                                                             key={item.name}
                                                                             href={item.href}
                                                                             className={cn(
                                                                                 "text-sm font-medium transition-colors border-l-2 pl-4 py-1",
                                                                                 isActive
                                                                                     ? "text-primary border-primary bg-primary/5"
                                                                                     : "text-white/40 border-transparent hover:text-white hover:border-white/10"
                                                                             )}
                                                                             onClick={() => setMobileMenuOpen(false)}
                                                                         >
                                                                             {item.name}
                                                                         </Link>
                                                                     );
                                                                 })}
                                                             </div>
                                                         )}
                                                     </AccordionContent>
                                                 </AccordionItem>
                                             )
                                         })}
                                     </Accordion>
                                    <div className="flex flex-col gap-4 mt-6">
                                        {singleLinks.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={cn(
                                                        "text-lg font-bold transition-all px-1 py-1",
                                                        isActive ? "text-primary" : "text-white/90 hover:text-primary"
                                                    )}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </nav>
                                <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center px-2">
                                        <div className="flex items-center gap-4 sm:gap-8">
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <DarkModeToggle />
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">Mode</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <ThemeCustomizer />
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("theme")}</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <LanguageSwitcher />
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("language")}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-center">
                                            <CurrencySwitcher />
                                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("currency")}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 mt-4">
                                        {status === "authenticated" && session?.user ? (
                                            <div className="space-y-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                                                
                                                {/* User Info header card */}
                                                <div className="flex items-center gap-3 pb-3 border-b border-white/5 relative z-10">
                                                    {session.user.image ? (
                                                        <img
                                                            src={session.user.image}
                                                            alt={userName}
                                                            className="h-10 w-10 rounded-full object-cover ring-1 ring-cyan-500/30"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/20 text-xs font-bold text-cyan-400 ring-1 ring-cyan-500/25">
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-white truncate leading-snug">{userName}</p>
                                                        <p className="text-[10px] text-white/40 truncate">{userEmail}</p>
                                                    </div>
                                                </div>

                                                {/* Mobile User Menu Links */}
                                                <div className="space-y-1 relative z-10 pt-1">
                                                    <Link
                                                        href={"/dashboard/settings" as any}
                                                        className="flex w-full items-center gap-2.5 py-2 px-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 active:bg-white/5 transition-all cursor-pointer"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 text-white/40" />
                                                        {t("profile")}
                                                    </Link>
                                                    <Link
                                                        href={"/dashboard" as any}
                                                        className="flex w-full items-center gap-2.5 py-2 px-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 active:bg-white/5 transition-all cursor-pointer"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <LayoutDashboard className="h-4 w-4 text-white/40" />
                                                        {t("dashboard_menu")}
                                                    </Link>
                                                    <Link
                                                        href={"/dashboard/settings" as any}
                                                        className="flex w-full items-center gap-2.5 py-2 px-2 text-xs font-semibold rounded-lg text-white/70 hover:text-white hover:bg-white/5 active:bg-white/5 transition-all cursor-pointer"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <Settings className="h-4 w-4 text-white/40" />
                                                        {t("settings")}
                                                    </Link>
                                                    <div className="h-px bg-white/5 my-2" />
                                                    <button
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            signOut({ callbackUrl: "/login" });
                                                        }}
                                                        className="flex w-full items-center gap-2.5 py-2 px-2 text-xs font-semibold rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/10 transition-all text-left cursor-pointer"
                                                    >
                                                        <LogOut className="h-4 w-4 text-red-400/80" />
                                                        {t("logout")}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button variant="outline" asChild className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white">
                                                <Link href="/login">{t("client_portal")}</Link>
                                            </Button>
                                        )}
                                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-transform text-white border-none shadow-lg shadow-cyan-500/20 font-bold h-12" asChild>
                                            <Link href="/demo">{t("free_consultation")}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            {!pathname.includes('/sikeres-fizetes') && (
                <div className="container mx-auto px-4">
                    <Breadcrumbs />
                </div>
            )}
        </>
    )
}
