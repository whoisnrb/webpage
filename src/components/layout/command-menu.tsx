"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { Command } from "cmdk"
import { Search, FileText, Home, Briefcase, Mail, ShoppingCart, User, Laptop, Shield, Server, Code } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function CommandMenu() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        const toggleCommandMenu = () => setOpen((open) => !open)
        window.addEventListener("toggle-command-menu", toggleCommandMenu)

        document.addEventListener("keydown", down)
        return () => {
            document.removeEventListener("keydown", down)
            window.removeEventListener("toggle-command-menu", toggleCommandMenu)
        }
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="fixed left-[50%] top-[20%] translate-x-[-50%] p-0 shadow-2xl bg-transparent border-none max-w-[640px] w-full z-[9999]">
                <VisuallyHidden>
                    <DialogTitle>Keresés</DialogTitle>
                </VisuallyHidden>
                <div className="glass rounded-xl overflow-hidden border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                    <Command className="w-full bg-transparent">
                        <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
                            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-white" />
                            <Command.Input
                                placeholder="Keresés..."
                                className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-white/40 text-white disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                            <Command.Empty className="py-6 text-center text-sm text-white/60">
                                Nincs találat.
                            </Command.Empty>

                            <Command.Group heading="Oldalak" className="text-white/60 px-2 py-1.5 text-xs font-medium">
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/"))}
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Főoldal</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/szolgaltatasok"))}
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>Szolgáltatások</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/blog"))}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Blog</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/kapcsolat"))}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Kapcsolat</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Szolgáltatások" className="text-white/60 px-2 py-1.5 text-xs font-medium mt-2">
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/szolgaltatasok/webfejlesztes"))}
                                >
                                    <Laptop className="mr-2 h-4 w-4" />
                                    <span>Webfejlesztés</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/szolgaltatasok/scriptek"))}
                                >
                                    <Code className="mr-2 h-4 w-4" />
                                    <span>Egyedi Scriptek</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/szolgaltatasok/rendszeruzemeltetes"))}
                                >
                                    <Server className="mr-2 h-4 w-4" />
                                    <span>Rendszerüzemeltetés</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/szolgaltatasok/biztonsag"))}
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Kiberbiztonság</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Egyéb" className="text-white/60 px-2 py-1.5 text-xs font-medium mt-2">
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/termekek"))}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    <span>Termékek</span>
                                </Command.Item>
                                <Command.Item
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white text-white/80 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    onSelect={() => runCommand(() => router.push("/login"))}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Bejelentkezés</span>
                                </Command.Item>
                            </Command.Group>
                        </Command.List>
                    </Command>
                </div>
            </DialogContent>
        </Dialog>
    )
}
