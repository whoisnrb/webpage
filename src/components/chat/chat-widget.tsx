"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useDragControls } from "framer-motion"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([
        { role: "assistant", content: "Szia! Alvin vagyok. Miben segíthetek ma?" }
    ])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const dragControls = useDragControls()

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                })
            })

            if (!response.ok) throw new Error("Failed to send message")

            const data = await response.json()
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: "assistant", content: "Bocsánat, hiba történt. Kérlek próbáld újra később." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                        drag
                        dragMomentum={false}
                        dragListener={false}
                        dragControls={dragControls}
                        className="pointer-events-auto"
                    >
                        <Card className="w-[350px] h-[500px] flex flex-col shadow-xl border-2">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-primary text-primary-foreground rounded-t-lg cursor-move touch-none"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/50 bg-background">
                                        <Image
                                            src="/alvin-avatar.png"
                                            alt="Alvin"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <CardTitle className="text-base">Alvin</CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <ScrollArea className="h-full p-4">
                                    <div className="flex flex-col gap-4">
                                        {messages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex gap-2 max-w-[80%]",
                                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                                )}>
                                                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                                </div>
                                                <div className={cn(
                                                    "rounded-lg px-3 py-2 text-sm",
                                                    msg.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-foreground"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-2 mr-auto max-w-[80%]">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                    <Bot className="h-4 w-4" />
                                                </div>
                                                <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-3 border-t bg-background">
                                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                                    <Input
                                        placeholder="Írj egy üzenetet..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <Button
                    size="lg"
                    className="h-16 w-16 rounded-full shadow-lg p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-110"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-primary/50 bg-background">
                        <Image
                            src="/alvin-avatar.png"
                            alt="Alvin"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </Button>
            )}
        </div>
    )
}
