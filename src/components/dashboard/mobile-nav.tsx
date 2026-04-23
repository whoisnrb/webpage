"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"

export function MobileNav() {
    const [isOpen, setIsOpen] = React.useState(false)

    // Close menu when clicking a link (since sidebar links are client-side)
    // We can't easily hook into Sidebar links without passing a close prop,
    // so we'll just listen for route changes or use a simple overlay.
    
    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="text-muted-foreground"
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        
                        {/* Sidebar Container */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[101] w-[280px] bg-[#080812] shadow-2xl md:hidden"
                        >
                            <div className="flex h-full flex-col">
                                <div className="flex items-center justify-end p-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground"
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-y-auto" onClick={() => setIsOpen(false)}>
                                    <Sidebar hideLogo={true} />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
