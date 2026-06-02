"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useDragControls } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import ReactMarkdown from "react-markdown"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const t = useTranslations("Alvin")
    const locale = useLocale()

    const [messages, setMessages] = React.useState<Message[]>([])

    React.useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: "assistant", content: t("welcome") }])
        }
    }, [t, messages.length])

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
                    history: messages,
                    locale: locale
                })
            })

            if (!response.ok) throw new Error("Failed to send message")

            const data = await response.json()
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: "assistant", content: t("error") }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragListener={false}
            dragControls={dragControls}
            className="fixed top-40 right-4 z-50 flex flex-col items-end gap-4"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                        className="pointer-events-auto"
                    >
                        <Card className="w-[360px] h-[520px] flex flex-col shadow-2xl shadow-cyan-500/10 border-white/10 bg-background/70 backdrop-blur-2xl rounded-2xl overflow-hidden ring-1 ring-white/5">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md cursor-move touch-none"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-cyan-400/50 bg-background/50 shadow-inner">
                                        <Image
                                            src="/alvin-avatar.png"
                                            alt="Alvin"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-1">
                                            {t("title")} <Sparkles className="w-3 h-3 text-cyan-400" />
                                        </CardTitle>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden relative">
                                {/* Ambient Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                                
                                <ScrollArea className="h-full p-4 relative z-10">
                                    <div className="flex flex-col gap-5">
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                key={i}
                                                className={cn(
                                                    "flex gap-3 max-w-[85%]",
                                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                                                    msg.role === "user" 
                                                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white" 
                                                        : "bg-gradient-to-br from-slate-700 to-slate-800 text-cyan-400 border border-slate-600"
                                                )}>
                                                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                                                    msg.role === "user"
                                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-tr-sm"
                                                        : "bg-slate-800/60 backdrop-blur-md text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700/50"
                                                )}>
                                                    {msg.role === "user" ? (
                                                        msg.content
                                                    ) : (
                                                        <div className="prose prose-invert prose-sm max-w-none">
                                                            <ReactMarkdown
                                                                components={{
                                                                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                                    strong: ({node, ...props}) => <strong className="font-semibold text-cyan-300" {...props} />,
                                                                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                                    li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                                                                    a: ({node, ...props}) => <a className="text-cyan-400 hover:underline underline-offset-2" {...props} />
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex gap-3 mr-auto max-w-[85%]"
                                            >
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-cyan-400 border border-slate-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                                    <Bot className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 border border-slate-700/50 shadow-sm">
                                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-3 border-t border-white/5 bg-background/50 backdrop-blur-xl">
                                <form onSubmit={handleSubmit} className="flex w-full gap-2 relative items-center">
                                    <Input
                                        placeholder={t("placeholder")}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={isLoading}
                                        className="flex-1 bg-slate-900/50 border-slate-700/50 focus-visible:ring-cyan-500/50 rounded-xl pr-12 text-sm placeholder:text-slate-500 h-10"
                                    />
                                    <Button 
                                        type="submit" 
                                        size="icon" 
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-1 top-1 bottom-1 h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-cyan-500/25 transition-all"
                                    >
                                        <Send className="h-4 w-4 ml-0.5" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <div onPointerDown={(e) => dragControls.start(e)} className="touch-none">
                    <Button
                        size="lg"
                        className="h-16 w-16 rounded-full shadow-2xl shadow-cyan-500/20 p-0 bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-110 cursor-move group relative"
                        onClick={() => setIsOpen(true)}
                    >
                        {/* Glow effect behind the avatar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-cyan-400/80 bg-background pointer-events-none z-10">
                            <Image
                                src="/alvin-avatar.png"
                                alt="Alvin"
                                fill
                                className="object-cover"
                                unoptimized
                                draggable={false}
                            />
                        </div>
                        
                        {/* Notification dot */}
                        <span className="absolute top-0 right-0 flex h-4 w-4 z-20">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-background"></span>
                        </span>
                    </Button>
                </div>
            )}
        </motion.div>
    )
}
