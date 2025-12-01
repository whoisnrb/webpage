"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
    id: string
    role: "bot" | "user"
    content: string
    type?: "text" | "input" | "email" | "textarea"
}

type FormData = {
    name: string
    email: string
    feedback: string
}

export function AiFeedbackChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Üdvözlöm! Én Alvin vagyok, az IT Services AI asszisztense. Szeretném kikérni a véleményét szolgáltatásainkról.",
            type: "text"
        },
        {
            id: "2",
            role: "bot",
            content: "Hogy szólíthatom?",
            type: "input"
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", feedback: "" })
    const [step, setStep] = useState<"name" | "email" | "feedback" | "done">("name")
    const [isTyping, setIsTyping] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            type: "text"
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        // Process input based on current step
        setTimeout(async () => {
            let nextStep = step
            let botResponse: Message | null = null

            if (step === "name") {
                setFormData(prev => ({ ...prev, name: userMsg.content }))
                botResponse = {
                    id: Date.now().toString(),
                    role: "bot",
                    content: `Köszönöm ${userMsg.content}! Milyen email címen érhetjük el, ha válaszolni szeretnénk?`,
                    type: "email"
                }
                nextStep = "email"
            } else if (step === "email") {
                setFormData(prev => ({ ...prev, email: userMsg.content }))
                botResponse = {
                    id: Date.now().toString(),
                    role: "bot",
                    content: "Rendben. Kérem, írja le részletesen a tapasztalatait, vagy hogy min javíthatnánk.",
                    type: "textarea"
                }
                nextStep = "feedback"
            } else if (step === "feedback") {
                setFormData(prev => ({ ...prev, feedback: userMsg.content }))

                // Here we would send data to n8n
                await sendToN8n({ ...formData, feedback: userMsg.content })

                botResponse = {
                    id: Date.now().toString(),
                    role: "bot",
                    content: "Köszönöm szépen! Az AI rendszerünk éppen elemzi a visszajelzését. Hamarosan értesítjük a fejleményekről.",
                    type: "text"
                }
                nextStep = "done"
            }

            if (botResponse) {
                setMessages(prev => [...prev, botResponse!])
            }
            setStep(nextStep)
            setIsTyping(false)
        }, 1000)
    }
    const sendToN8n = async (data: FormData) => {
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error("Failed to send feedback")
            }

            console.log("Feedback sent successfully")
        } catch (error) {
            console.error("Failed to send to n8n", error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-primary/50 bg-background">
                        <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Alvin</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <Avatar className="h-8 w-8">
                                    {msg.role === "bot" ? (
                                        <div className="relative h-full w-full rounded-full overflow-hidden border border-primary/50 bg-background">
                                            <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                                        </div>
                                    ) : (
                                        <div className="h-full w-full bg-secondary/10 flex items-center justify-center">
                                            <User className="h-4 w-4 text-secondary" />
                                        </div>
                                    )}
                                </Avatar>
                                <div
                                    className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${msg.role === "bot"
                                        ? "bg-muted text-foreground rounded-tl-none"
                                        : "bg-primary text-primary-foreground rounded-tr-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <Avatar className="h-8 w-8">
                                    <div className="relative h-full w-full rounded-full overflow-hidden border border-primary/50 bg-background">
                                        <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                                    </div>
                                </Avatar>
                                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
                <div className="flex w-full gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={step === "email" ? "pelda@email.hu" : "Írja ide az üzenetét..."}
                        disabled={step === "done" || isTyping}
                        className="flex-1"
                        autoFocus
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || step === "done" || isTyping}
                        size="icon"
                    >
                        {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
