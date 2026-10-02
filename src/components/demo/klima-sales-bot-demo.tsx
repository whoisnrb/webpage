"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Bot, 
    User, 
    Send, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    Phone, 
    MapPin, 
    Home, 
    ThermometerSnowflake, 
    Coins, 
    ShieldCheck, 
    RotateCcw,
    Zap
} from "lucide-react";

interface Message {
    role: "assistant" | "user";
    content: string;
}

interface LeadData {
    name?: string | null;
    phone?: string | null;
    city?: string | null;
    propertySize?: string | null;
    needType?: string | null;
    estimatedBudget?: string | null;
    status: "érdeklődő" | "igényfelmérés" | "árajánlat_előkészítve" | "lead_rögzítve";
}

const QUICK_PROMPTS_HU = [
    "35 m²-es nappaliba keresek klímát fűtésre is",
    "Mennyibe kerül egy 3.5 kW-os klíma beszereléssel?",
    "H-tarifára alkalmas gépet szeretnék",
    "Ingyenes felmérést kérnék, Kovács Péter vagyok: +36 30 555 1234, Győr"
];

const QUICK_PROMPTS_EN = [
    "Looking for an AC for a 35 m² living room with heating support",
    "How much does a 3.5 kW AC cost installed?",
    "I need an energy-efficient unit for winter heating",
    "I'd like a free survey. I'm Peter Smith: +36 30 555 1234, Győr"
];

const WELCOME_HU = "Üdvözlöm! A KlímaTech Pro virtuális szakértője vagyok. Szívesen segítek a tökéletes klíma vagy hőszivattyú kiválasztásában, és azonnali tájékoztató árakat is tudok adni.\n\nMekkora helyiség hűtését vagy fűtését tervezi?";
const WELCOME_EN = "Welcome! I am the virtual consultant for KlímaTech Pro. I'm here to help you choose the ideal AC or heat pump system and provide instant indicative pricing.\n\nWhat is the size of the room or property you are looking to cool or heat?";

export function KlimaSalesBotDemo({ locale = "hu" }: { locale?: string }) {
    const isEn = locale === "en";
    const quickPrompts = isEn ? QUICK_PROMPTS_EN : QUICK_PROMPTS_HU;
    const welcomeMessage = isEn ? WELCOME_EN : WELCOME_HU;

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: welcomeMessage
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lead, setLead] = useState<LeadData>({ status: "érdeklődő" });
    const [usageStats, setUsageStats] = useState<{ totalTokens: number; approxHuf: string }>({
        totalTokens: 0,
        approxHuf: "0.00"
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Update greeting when locale changes
    useEffect(() => {
        setMessages([
            {
                role: "assistant",
                content: isEn ? WELCOME_EN : WELCOME_HU
            }
        ]);
        setLead({ status: "érdeklődő" });
    }, [isEn]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (textToSend?: string) => {
        const messageText = (textToSend || input).trim();
        if (!messageText || isLoading) return;

        const newMessages: Message[] = [...messages, { role: "user", content: messageText }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/demo/klima-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    history: messages,
                    locale: isEn ? "en" : "hu"
                })
            });

            if (!res.ok) {
                throw new Error("Hálózati hiba");
            }

            const data = await res.json();
            
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

            if (data.lead) {
                setLead((prev) => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.entries(data.lead).filter(([_, v]) => v !== null && v !== undefined)
                    )
                }));
            }

            if (data.usage) {
                setUsageStats((prev) => ({
                    totalTokens: prev.totalTokens + (data.usage.totalTokens || 0),
                    approxHuf: (parseFloat(prev.approxHuf) + parseFloat(data.usage.approxCostHuf || "0")).toFixed(2)
                }));
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: isEn 
                        ? "Sorry, a temporary network error occurred with Azure OpenAI. Please try again!"
                        : "Elnézést, pillanatnyi hiba lépett fel az Azure OpenAI kapcsolódásban. Kérjük, próbálja újra!"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([
            {
                role: "assistant",
                content: isEn ? WELCOME_EN : WELCOME_HU
            }
        ]);
        setLead({ status: "érdeklődő" });
        setUsageStats({ totalTokens: 0, approxHuf: "0.00" });
    };

    const getStatusBadge = (status: LeadData["status"]) => {
        switch (status) {
            case "lead_rögzítve":
                return (
                    <Badge className="bg-emerald-600 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {isEn ? "Qualified Lead Captured" : "Minősített Lead Rögzítve"}
                    </Badge>
                );
            case "árajánlat_előkészítve":
                return (
                    <Badge className="bg-blue-600 text-white flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {isEn ? "Quote Prepared" : "Ajánlat Előkészítve"}
                    </Badge>
                );
            case "igényfelmérés":
                return (
                    <Badge className="bg-amber-600 text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {isEn ? "Needs Assessment" : "Igényfelmérés folyamatban"}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        {isEn ? "Initial Inquirer" : "Kezdeti Érdeklődő"}
                    </Badge>
                );
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-8 grid lg:grid-cols-12 gap-8 items-start">
            {/* BAL OLDAL: ÉLŐ CHAT ABLAK (7 oszlop) */}
            <div className="lg:col-span-7 flex flex-col h-[650px] bg-card border rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-muted/60 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                                {isEn ? "KlímaTech Pro Consultant" : "KlímaTech Pro Tanácsadó"}
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-primary" /> Powered by Azure OpenAI (GPT-4o)
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset} title={isEn ? "Reset conversation" : "Beszélgetés újrakezdése"}>
                        <RotateCcw className="w-4 h-4 mr-1" /> {isEn ? "Reset" : "Újra"}
                    </Button>
                </div>

                {/* Üzenetfolyam */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <div
                                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-line leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none shadow"
                                        : "bg-muted/80 text-foreground rounded-tl-none border"
                                }`}
                            >
                                {msg.content}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-1">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start items-center text-xs text-muted-foreground">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="bg-muted px-4 py-2 rounded-xl border animate-pulse">
                                {isEn ? "Azure GPT-4o is typing a response..." : "Az Azure GPT-4o épp gépeli a választ..."}
                            </div>
                        </div>
                    )}
                </div>

                {/* Gyors kérdések */}
                <div className="px-4 py-2 border-t bg-muted/20 flex gap-2 overflow-x-auto text-xs scrollbar-none">
                    {quickPrompts.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            disabled={isLoading}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-background border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 text-left"
                        >
                            💡 {prompt}
                        </button>
                    ))}
                </div>

                {/* Beviteli mező */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="p-3 bg-background border-t flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isEn ? "Enter your requirements or room size..." : "Írja be az igényeit vagy a szobaméretet..."}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            {/* JOBB OLDAL: ÉLŐ LEAD RADAR & CRM ADATKINYERÉS (5 oszlop) */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-2 border-primary/20 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                {isEn ? "Live Lead Radar (CRM)" : "Élő Lead Radar (CRM)"}
                            </CardTitle>
                            {getStatusBadge(lead.status)}
                        </div>
                        <CardDescription>
                            {isEn 
                                ? "The AI structures customer requirements and contact info in real-time in the background."
                                : "Az AI a beszélgetés közben háttérben valós időben strukturálja a vevői adatokat."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {/* Név */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span>{isEn ? "Customer Name:" : "Ügyfél neve:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.name ? "text-primary" : "text-muted-foreground italic"}`}>
                                    {lead.name || (isEn ? "Not provided yet" : "Még nem adta meg")}
                                </span>
                            </div>

                            {/* Telefonszám */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span>{isEn ? "Phone Number:" : "Telefonszám:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.phone ? "text-emerald-600 dark:text-emerald-400 font-mono" : "text-muted-foreground italic"}`}>
                                    {lead.phone || (isEn ? "Not provided yet" : "Még nem adta meg")}
                                </span>
                            </div>

                            {/* Település */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{isEn ? "Location:" : "Helyszín:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.city ? "text-foreground" : "text-muted-foreground italic"}`}>
                                    {lead.city || (isEn ? "Unknown" : "Nem ismert")}
                                </span>
                            </div>

                            {/* Helyiség mérete */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Home className="w-4 h-4" />
                                    <span>{isEn ? "Property Size:" : "Alapterület:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.propertySize ? "text-foreground" : "text-muted-foreground italic"}`}>
                                    {lead.propertySize || (isEn ? "Pending..." : "Folyamatban...")}
                                </span>
                            </div>

                            {/* Cél / Típus */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ThermometerSnowflake className="w-4 h-4" />
                                    <span>{isEn ? "Intended Use:" : "Felhasználási cél:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.needType ? "text-foreground" : "text-muted-foreground italic"}`}>
                                    {lead.needType || (isEn ? "Cooling / Heating assessment" : "Hűtés / Fűtés felmérése")}
                                </span>
                            </div>

                            {/* Becsült összeg */}
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Coins className="w-4 h-4" />
                                    <span>{isEn ? "Estimated Budget:" : "Becsült keretösszeg:"}</span>
                                </div>
                                <span className={`font-semibold ${lead.estimatedBudget ? "text-primary" : "text-muted-foreground italic"}`}>
                                    {lead.estimatedBudget || (isEn ? "Calculating..." : "Kalkuláció alatt")}
                                </span>
                            </div>
                        </div>

                        {/* Értesítési státusz */}
                        {lead.phone && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong>{isEn ? "Instant Lead Alert Active!" : "Azonnali Lead Riasztás aktív!"}</strong>
                                    <p className="mt-0.5 text-muted-foreground">
                                        {isEn 
                                            ? "In production, this automatically dispatches an SMS or email notification to your sales rep."
                                            : "Éles környezetben ez azonnal SMS-t vagy e-mailt küld az értékesítőnek a telefonszámmal."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* TOKEN & KÖLTSÉG METRIKA (Kliens szemszögből) */}
                <Card className="bg-muted/30 border">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                            <span>{isEn ? "Enterprise Resource & Cost" : "Vállalati Erőforrás & Költség"}</span>
                            <Badge variant="secondary" className="text-[10px]">Microsoft Azure GPT-4o</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0 grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-background rounded-lg border">
                            <div className="text-xl font-bold font-mono">{usageStats.totalTokens}</div>
                            <div className="text-[11px] text-muted-foreground">{isEn ? "Tokens processed" : "Feldolgozott token"}</div>
                        </div>
                        <div className="p-3 bg-background rounded-lg border">
                            <div className="text-xl font-bold font-mono text-emerald-600">~{usageStats.approxHuf} Ft</div>
                            <div className="text-[11px] text-muted-foreground">{isEn ? "Est. operational cost / msg" : "Becsült üzemeltetés / üzenet"}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
