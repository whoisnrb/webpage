"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Globe, Server, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { LocalizedReferenceDTO } from "@/app/actions/reference";

interface ReferenceFilterGridProps {
    studies: LocalizedReferenceDTO[];
    locale: string;
}

export function ReferenceFilterGrid({ studies, locale }: ReferenceFilterGridProps) {
    const isEn = locale === "en";
    const [selectedTab, setSelectedTab] = useState<"ALL" | "CLIENT" | "DEMO">("ALL");

    const demoCount = studies.filter(s => s.type === "DEMO").length;
    const clientCount = studies.filter(s => s.type !== "DEMO").length;

    const filteredStudies = studies.filter(study => {
        if (selectedTab === "DEMO") return study.type === "DEMO";
        if (selectedTab === "CLIENT") return study.type !== "DEMO";
        return true;
    });

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Filter Pills / Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={() => setSelectedTab("ALL")}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        selectedTab === "ALL"
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                            : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border"
                    }`}
                >
                    {isEn ? `All Projects (${studies.length})` : `Összes munka (${studies.length})`}
                </button>

                <button
                    onClick={() => setSelectedTab("CLIENT")}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedTab === "CLIENT"
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                            : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border"
                    }`}
                >
                    <Globe className="w-4 h-4" />
                    {isEn ? `Client Case Studies (${clientCount})` : `Éles Ügyfélmunkák (${clientCount})`}
                </button>

                <button
                    onClick={() => setSelectedTab("DEMO")}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                        selectedTab === "DEMO"
                            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 scale-105"
                            : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}
                >
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
                    <span className="font-semibold">{isEn ? `Interactive Demos (${demoCount})` : `Interaktív Demók (${demoCount})`}</span>
                    {selectedTab !== "DEMO" && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                    )}
                </button>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredStudies.map((study, index) => {
                    const isDemo = study.type === "DEMO";
                    const isImageUrl = study.image.startsWith("/") || study.image.startsWith("data:image") || study.image.startsWith("http");

                    return (
                        <Link href={`/referenciak/${study.slug}` as any} key={index} className="group h-full">
                            <Card className={`flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 ${
                                isDemo 
                                    ? "border-amber-500/40 hover:border-amber-500/80 bg-gradient-to-b from-card to-amber-500/[0.03]" 
                                    : "hover:border-primary/20"
                            } cursor-pointer`}>
                                <div className={`h-56 w-full flex items-center justify-center relative overflow-hidden ${!isImageUrl ? study.image : ""}`}>
                                    {isImageUrl ? (
                                        <img
                                            src={study.image}
                                            alt={study.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    )}

                                    {/* Placeholder text only if no image */}
                                    {!isImageUrl && (
                                        <div className="text-center p-6 relative z-10">
                                            <div className="font-bold text-2xl opacity-20 uppercase tracking-widest text-foreground">
                                                {study.client.split(" ")[0]}
                                            </div>
                                        </div>
                                    )}

                                    {/* DEMO Overlay Badge on Image */}
                                    {isDemo && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-amber-300/40">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                {isEn ? "Live Interactive Demo" : "Élő Interaktív Demó"}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant={isDemo ? "outline" : "secondary"} className={`mb-2 ${isDemo ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10" : ""}`}>
                                            {study.category}
                                        </Badge>
                                    </div>
                                    <CardTitle className={`text-2xl mb-2 transition-colors ${isDemo ? "group-hover:text-amber-500" : "group-hover:text-primary"}`}>
                                        {study.title}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-foreground/80 flex items-center gap-2">
                                        {study.clientLogo && (
                                            <span className="inline-flex items-center bg-white rounded-md p-1 border border-border/50 shadow-sm shrink-0">
                                                <img src={study.clientLogo} alt={study.client} className="h-5 w-auto max-w-[80px] object-contain" />
                                            </span>
                                        )}
                                        {study.client}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                                        {study.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {study.tags.map((tag, i) => (
                                            <span key={i} className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium text-muted-foreground border">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {isDemo ? (
                                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 group-hover:scale-[1.02] transition-all">
                                            {isEn ? "Try the Live Demo" : "Demó kipróbálása"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            {isEn ? "View Case Study" : "Részletek megtekintése"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
