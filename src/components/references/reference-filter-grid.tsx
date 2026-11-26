"use client";

import React, { useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Globe, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { LocalizedReferenceDTO } from "@/app/actions/reference";

interface ReferenceFilterGridProps {
    studies: LocalizedReferenceDTO[];
    locale: string;
}

const INITIAL_VISIBLE = 9;

export function ReferenceFilterGrid({ studies, locale }: ReferenceFilterGridProps) {
    const isEn = locale === "en";
    const [selectedTab, setSelectedTab] = useState<"ALL" | "CLIENT" | "DEMO">("ALL");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

    const demoCount = studies.filter(s => s.type === "DEMO").length;
    const clientCount = studies.filter(s => s.type !== "DEMO").length;

    const filteredStudies = studies.filter(study => {
        if (selectedTab === "DEMO") return study.type === "DEMO";
        if (selectedTab === "CLIENT") return study.type !== "DEMO";
        return true;
    });

    const displayedStudies = filteredStudies.slice(0, visibleCount);
    const remaining = filteredStudies.length - displayedStudies.length;

    const handleTabChange = (tab: "ALL" | "CLIENT" | "DEMO") => {
        setSelectedTab(tab);
        setVisibleCount(INITIAL_VISIBLE);
    };

    return (
        <div className="space-y-8">
            {/* Filter Pills / Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => handleTabChange("ALL")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        selectedTab === "ALL"
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                            : "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10"
                    }`}
                >
                    {isEn ? `All Projects (${studies.length})` : `Összes munka (${studies.length})`}
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange("CLIENT")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedTab === "CLIENT"
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                            : "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10"
                    }`}
                >
                    <Globe className="w-4 h-4" />
                    {isEn ? `Client Case Studies (${clientCount})` : `Éles Ügyfélmunkák (${clientCount})`}
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange("DEMO")}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 relative cursor-pointer ${
                        selectedTab === "DEMO"
                            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-orange-500/25"
                            : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedStudies.map((study, index) => {
                    const isDemo = study.type === "DEMO";
                    const isImageUrl = study.image.startsWith("/") || study.image.startsWith("data:image") || study.image.startsWith("http");

                    return (
                        <Link href={`/referenciak/${study.slug}` as any} key={study.slug || index} className="group h-full">
                            <div className={`flex flex-col h-full overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                                isDemo
                                    ? "border-amber-500/35 hover:border-amber-400/75 bg-gradient-to-b from-[#06101c]/90 to-amber-500/[0.04] hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]"
                                    : "border-white/10 hover:border-cyan-500/40 bg-[#06101c]/80 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.25)]"
                            }`}>
                                <div className={`h-48 w-full flex items-center justify-center relative overflow-hidden bg-slate-900/60 ${!isImageUrl ? study.image : ""}`}>
                                    {isImageUrl ? (
                                        <img
                                            src={study.image}
                                            alt={study.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    )}

                                    {!isImageUrl && (
                                        <div className="text-center p-6 relative z-10">
                                            <div className="font-bold text-2xl opacity-20 uppercase tracking-widest text-foreground">
                                                {study.client.split(" ")[0]}
                                            </div>
                                        </div>
                                    )}

                                    {isDemo && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-amber-500/90 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-amber-300/40">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                {isEn ? "Live Interactive Demo" : "Élő Interaktív Demó"}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="p-5 pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className={`text-[11px] font-semibold ${isDemo ? "border-amber-500/40 text-amber-400 bg-amber-500/10" : "border-white/15 bg-white/5 text-cyan-300"}`}>
                                            {study.category}
                                        </Badge>
                                    </div>
                                    <CardTitle className={`text-lg md:text-xl leading-snug line-clamp-2 transition-colors ${isDemo ? "group-hover:text-amber-400" : "group-hover:text-cyan-300"}`}>
                                        {study.title}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-white/60 text-xs flex items-center gap-2 pt-1">
                                        {study.clientLogo && (
                                            <span className="inline-flex items-center bg-white rounded-md p-1 border border-white/10 shadow-sm shrink-0">
                                                <img src={study.clientLogo} alt={study.client} loading="lazy" decoding="async" className="h-4 w-auto max-w-[70px] object-contain" />
                                            </span>
                                        )}
                                        <span className="truncate">{study.client}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-5 pt-0 flex-1 flex flex-col">
                                    <p className="text-white/55 text-xs sm:text-sm mb-4 flex-1 leading-relaxed line-clamp-3">
                                        {study.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {study.tags.slice(0, 4).map((tag, i) => (
                                            <span key={i} className="text-[11px] bg-white/[0.04] px-2 py-0.5 rounded-md font-medium text-white/60 border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {isDemo ? (
                                        <Button className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all">
                                            {isEn ? "Try the Live Demo" : "Demó kipróbálása"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full h-10 rounded-xl border-white/15 bg-white/[0.03] text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-600 group-hover:text-slate-950 group-hover:border-transparent font-semibold transition-all">
                                            {isEn ? "View Case Study" : "Részletek megtekintése"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )}
                                </CardContent>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {remaining > 0 && (
                <div className="pt-4 text-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVisibleCount(v => v + 9)}
                        className="rounded-full px-6 h-10 border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold cursor-pointer"
                    >
                        <ChevronDown className="mr-2 h-4 w-4 text-cyan-400" />
                        {isEn
                            ? `Load More Case Studies (+${remaining})`
                            : `További referenciák betöltése (+${remaining})`}
                    </Button>
                </div>
            )}
        </div>
    );
}
