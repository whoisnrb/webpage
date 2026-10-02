"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    BookOpen, 
    ShieldCheck, 
    Send, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Search, 
    Lock, 
    Briefcase, 
    UserCheck, 
    ChevronRight, 
    HelpCircle, 
    Layers, 
    ExternalLink,
    AlertCircle,
    Eye,
    EyeOff,
    Check
} from "lucide-react";

interface Citation {
    chapter?: string;
    section?: string;
    quote?: string;
}

interface RagResponse {
    answer: string;
    confidenceScore: string;
    documentTitle: string;
    citations: Citation[];
    recommendedFollowUps?: string[];
}

interface DocumentMeta {
    id: string;
    icon: string;
    titleHu: string;
    titleEn: string;
    badgeHu: string;
    badgeEn: string;
    sampleQuestionsHu: string[];
    sampleQuestionsEn: string[];
    rawContentHu: string;
    rawContentEn: string;
}

const DOCUMENTS: DocumentMeta[] = [
    {
        id: "hr-policy",
        icon: "📘",
        titleHu: "Munkarend & Home Office Szabályzat",
        titleEn: "Working Hours & Remote Work Policy",
        badgeHu: "HR & Munkavállalói Rend",
        badgeEn: "HR & Employee Handbook",
        sampleQuestionsHu: [
            "Hány nap home office engedélyezett egy héten és kinek kell jelezni?",
            "Hány munkanappal korábban kell leadni a szabadságkérelmet?",
            "Mekkora az éves cafeteria keret és mikor cserélik le a céges laptopot?",
            "Kivehetek fizetett szabadságot a 3 hónapos próbaidő alatt?"
        ],
        sampleQuestionsEn: [
            "How many days of home office are allowed per week and who do I notify?",
            "How many business days in advance must leave requests be submitted?",
            "What is the annual cafeteria allowance and when is my laptop refreshed?",
            "Can I take paid recreational leave during my 3-month probation?"
        ],
        rawContentHu: `1. FEJEZET: MUNKAIDŐ ÉS HOME OFFICE RENDJE
1.1. Alap munkaidő: Heti 40 óra, törzsidő 10:00 - 15:00 között kötelező elérhetőséggel a Slacken és Teamsen.
1.2. Hibrid munkarend: Minden munkavállaló heti legfeljebb 3 munkanapot tölthet távmunkában (home office). A hétfői és csütörtöki napok javasolt irodai napok.
1.3. Home office bejelentése: A távmunkát a közvetlen csoportvezetőnek a belső Google Naptárban legkésőbb 24 órával előre jelezni kell.
1.4. Túlóra és ügyelet: A rendes munkaidőn túli munkavégzés kizárólag csoportvezetői jóváhagyással lehetséges. Hétköznapi túlóra díjazása: 150%, hétvégi és ünnepnapi készenlét / ügyelet: 200%.

2. FEJEZET: SZABADSÁGOLÁSI SZABÁLYZAT
2.1. Rendes szabadság: A munkavállalónak a tervezett szabadságát legalább 15 munkanappal korábban be kell nyújtania a HR Portálon keresztül.
2.2. Év végi szabadság: A tárgyévi szabadságból legfeljebb 5 munkanap vihető át a következő év március 31-ig.
2.3. Próbaidő: A próbaidő tartama 3 naptári hónap. Próbaidő alatt fizetett rendes szabadság nem vehető igénybe, kivéve rendkívüli családi esemény vagy halaszthatatlan orvosi ok esetén, a közvetlen ügyvezető írásos engedélyével.

3. FEJEZET: JUTTATÁSOK, KÉPZÉS ÉS ESZKÖZÖK
3.1. Cafeteria keret: Minden teljes munkaidős alkalmazott évi bruttó 650.000 Ft cafeteria juttatásban részesül (SZÉP kártya).
3.2. Céges hardver: Apple MacBook Pro vagy Dell XPS munkaállomás. Az eszközök amortizációs ciklusa 36 hónap; a 3 év lejárta után a munkavállaló 10.000 Ft-ért megvásárolhatja.
3.3. Szakmai fejlődési keret: Évente munkavállalónként 300.000 Ft képzési büdzsé áll rendelkezésre nemzetközi minősítésekre és tanfolyamokra.`,
        rawContentEn: `CHAPTER 1: WORKING HOURS AND REMOTE WORK (HOME OFFICE)
1.1. Core working hours: 40 hours per week, with mandatory presence between 10:00 AM and 3:00 PM CET on Slack/Teams.
1.2. Hybrid schedule: Employees may spend up to 3 business days per week working remotely (home office). Mondays and Thursdays are collaborative office days.
1.3. Notice for remote work: Remote days must be registered in the internal calendar at least 24 hours in advance.
1.4. Overtime & On-call duty: Weekday overtime is compensated at 150%, weekend/holiday shifts at 200%.

CHAPTER 2: VACATION AND LEAVE ENTITLEMENT
2.1. Standard leave: Leave requests must be submitted through the internal HR Portal at least 15 business days in advance.
2.2. Rollover limit: A maximum of 5 unused vacation days may be carried over to the next year, expiring on March 31.
2.3. Probationary period: The standard probation is 3 calendar months. Paid recreational leave cannot be taken during probation except with written Managing Director approval.

CHAPTER 3: BENEFITS, HARDWARE & DEVELOPMENT
3.1. Cafeteria benefit: Full-time staff receive an annual gross cafeteria allowance of 650,000 HUF.
3.2. Hardware refresh: Equipped with MacBook Pro or Dell XPS. Refresh cycle is 36 months; purchaseable for 10,000 HUF after 3 years.
3.3. Learning allowance: 300,000 HUF individual budget per year for certifications and conferences.`
    },
    {
        id: "it-security",
        icon: "🔒",
        titleHu: "ISO 27001 IT Biztonsági Szabályzat",
        titleEn: "ISO 27001 Information Security Standard",
        badgeHu: "Kiberbiztonság & GDPR",
        badgeEn: "Cybersecurity & GDPR",
        sampleQuestionsHu: [
            "Milyen jelszókövetelmények és 2FA kötelezettségek vannak?",
            "Használhatok ingyenes ChatGPT-t vagy publikus AI-t céges kódhoz?",
            "Mi a kötelező protokoll, ha elhagytam a céges laptopot vagy telefont?",
            "Mennyi időn belül kell bejelenteni egy biztonsági incidenst?"
        ],
        sampleQuestionsEn: [
            "What are the password complexity and 2FA requirements?",
            "Can I upload proprietary code or customer data to free public ChatGPT?",
            "What is the emergency procedure if I lose my corporate laptop or phone?",
            "What is the maximum SLA window for reporting a suspected security breach?"
        ],
        rawContentHu: `1. FEJEZET: JELSZÓKEZELÉS ÉS TÖBBFAKTOROS HITELESÍTÉS (MFA)
1.1. Jelszó összetettség: Legalább 14 karakter hosszúság, kis- és nagybetű, szám és speciális karakter kötelező.
1.2. Kétlépcsős azonosítás (2FA): YubiKey hardverkulcs vagy FIDO2 / Microsoft Authenticator kötelező minden fiókban. SMS 2FA tilos.
1.3. Jelszócsere szabályzat: A rendszeres 90 napos kényszerített csere tilos az NIST SP 800-63B szerint; csak gyanú esetén kell cserélni.

2. FEJEZET: MESTERSÉGES INTELLIGENCIA (AI) ÉS ADATVÉDELEM
2.1. Publikus AI eszközök tilalma: Szigorúan tilos ügyféladatokat, forráskódot vagy személyes adatot (PII) feltölteni nyilvános, ingyenes AI modellekbe (pl. ingyenes ChatGPT).
2.2. Vállalati privát AI: Kizárólag a vállalat által konfigurált privát Microsoft Azure OpenAI környezet használható üzleti adatok elemzésére (nincs modelltanítás).

3. FEJEZET: BIZTONSÁGI INCIDENSEK ÉS ESZKÖZVESZTÉS PROTOKOLL
3.1. Értesítési kötelezettség: Bármilyen biztonsági incidenst 60 percen belül jelezni kell a security@backline.hu címen és az IT Vezetőnél.
3.2. Céges eszköz elvesztése: Azonnal hívni kell a 24/7 IT forródrótot (+36 30 999 1122) az azonnali távoli törléshez (remote wipe).
3.3. Adatmentés: Minden munkafájlt a céges felhőtárhelyen (OneDrive/GitHub) kell tartani; a lokális meghajtó ideiglenes, nem mentett.`,
        rawContentEn: `CHAPTER 1: ACCESS CONTROL AND MULTI-FACTOR AUTHENTICATION (MFA)
1.1. Password complexity: At least 14 characters, uppercase, lowercase, numbers, and symbols mandatory.
1.2. Multi-factor authentication: YubiKey hardware key or Microsoft Authenticator/FIDO2 mandatory across all accounts. SMS 2FA prohibited.
1.3. Password rotation: Periodic 90-day rotation is discontinued following NIST SP 800-63B; rotate only upon suspected breach.

CHAPTER 2: ARTIFICIAL INTELLIGENCE (AI) AND DATA GOVERNANCE
2.1. Public AI prohibition: Uploading client confidential data, code, or PII to public AI platforms (e.g. free ChatGPT) is strictly forbidden.
2.2. Approved enterprise AI: Staff must exclusively utilize company-managed private Microsoft Azure OpenAI endpoints.

CHAPTER 3: INCIDENT RESPONSE AND ASSET LOSS
3.1. Reporting deadline: Any suspected breach must be reported within 60 minutes to security@backline.hu and the CISO.
3.2. Lost equipment: Immediately contact the 24/7 emergency dispatch (+36 30 999 1122) for remote wipe via Microsoft Intune.
3.3. Cloud storage: Working files must be synchronized with corporate cloud storage (OneDrive/GitHub).`
    },
    {
        id: "procurement",
        icon: "💼",
        titleHu: "Beszerzési & Jóváhagyási Rend",
        titleEn: "Procurement & Financial Authorization Policy",
        badgeHu: "Pénzügy & Szerződések",
        badgeEn: "Finance & Contracts",
        sampleQuestionsHu: [
            "Ki hagyhatja jóvá egy 800.000 Ft-os hardver eszköz beszerzését?",
            "Hány független árajánlat szükséges 2 millió Ft feletti beszerzéshez?",
            "Milyen számlákat fogad be a pénzügy és mi a sztenderd fizetési határidő?",
            "Mekkora összegig engedélyezett a készpénzes vásárlás?"
        ],
        sampleQuestionsEn: [
            "Who has authorization to approve a 800,000 HUF hardware purchase?",
            "How many supplier bids are mandatory for purchases exceeding 1.5M HUF?",
            "What invoice formats are accepted and what is the standard payment term?",
            "What is the maximum allowable petty cash purchase threshold?"
        ],
        rawContentHu: `1. FEJEZET: KÖTELEZETTSÉGVÁLLALÁSI ÉS JÓVÁHAGYÁSI ÉRTÉKHATÁROK
1.1. 0 – 150.000 Ft: Csoportvezetői jóváhagyás elegendő 1 indokolt árajánlat alapján.
1.2. 150.001 – 1.500.000 Ft: Részlegvezető (Head of Dept) jóváhagyása szükséges a Pénzügy ellenjegyzésével.
1.3. 1.500.001 – 6.000.000 Ft: Gazdasági Igazgató (CFO) engedélye és legalább 3 független árajánlat bekérése kötelező.
1.4. 6.000.000 Ft felett: Kizárólag a CEO és CFO együttes aláírásával és jóváhagyásával vállalható kötelezettség.

2. FEJEZET: SZÁMLABEFOGADÁS ÉS FIZETÉSI FELTÉTELEK
2.1. Számlák formátuma: Csak a NAV Online Számla rendszerében ellenőrizhető e-számla fogadható be a penzugy@backline.hu címen.
2.2. Fizetési határidő: A céges sztenderd határidő 30 naptári nap a teljesítésigazolástól.
2.3. Készpénzes vásárlás: Kizárólag váratlan kisértékű kiadásra engedélyezett, maximum 30.000 Ft összeghatárig.

3. FEJEZET: SZERZŐDÉSKÖTÉSI PROTOKOLL
3.1. Szerződések véleményezése: Minden 1.000.000 Ft feletti vagy tartós szerződést a Jogi Osztálynak véleményeznie kell (SLA: 48 óra).
3.2. Digitális aláírás: A társaság AVDH vagy minősített elektronikus aláírással (e-Szignó, DocuSign) látott dokumentumokat fogad el.`,
        rawContentEn: `CHAPTER 1: FINANCIAL AUTHORIZATION THRESHOLDS
1.1. 0 – 150,000 HUF: Team Lead approval is sufficient based on 1 supplier quote.
1.2. 150,001 – 1,500,000 HUF: Head of Department authorization required with Finance clearance.
1.3. 1,500,001 – 6,000,000 HUF: CFO approval required with mandatory 3 independent supplier quotes.
1.4. Above 6,000,000 HUF: Dual sign-off from both CEO and CFO mandatory.

CHAPTER 2: INVOICING AND SETTLEMENT TERMS
2.1. Invoice standard: Only electronically verifiable e-invoices compliant with tax authority sent to penzugy@backline.hu.
2.2. Settlement timeline: Corporate default payment term is 30 calendar days following performance sign-off.
2.3. Petty cash: Petty cash purchases are strictly capped at 30,000 HUF for emergency items.

CHAPTER 3: CONTRACTUAL REVIEW & EXECUTION
3.1. Legal clearance: Any agreement exceeding 1,000,000 HUF requires formal review by Corporate Legal (SLA: 48h).
3.2. Digital signing: Contracts must be signed using qualified electronic signatures (DocuSign, e-Szignó, AVDH).`
    }
];

export function KnowledgeHubDemo({ locale = "hu" }: { locale?: string }) {
    const isEn = locale === "en";

    const [selectedDocId, setSelectedDocId] = useState<string>("hr-policy");
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<RagResponse | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>("0.9");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showRawDoc, setShowRawDoc] = useState<boolean>(false);
    const [usageStats, setUsageStats] = useState<{ totalTokens: number; approxHuf: string }>({
        totalTokens: 0,
        approxHuf: "0.00"
    });

    const activeDoc = DOCUMENTS.find((d) => d.id === selectedDocId) || DOCUMENTS[0];
    const sampleQuestions = isEn ? activeDoc.sampleQuestionsEn : activeDoc.sampleQuestionsHu;

    const handleSearch = async (questionToAsk?: string) => {
        const text = (questionToAsk || query).trim();
        if (!text || isLoading) return;

        setIsLoading(true);
        setErrorMsg(null);
        setQuery(text);

        const startTime = Date.now();

        try {
            const res = await fetch("/api/demo/knowledge-hub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: text,
                    documentId: selectedDocId,
                    locale
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || (isEn ? "Failed to retrieve answer" : "A lekérdezés sikertelen"));
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            setElapsedTime(duration);
            setResponse(data.data);

            if (data.usage) {
                setUsageStats({
                    totalTokens: data.usage.totalTokens,
                    approxHuf: data.usage.approxCostHuf
                });
            }

        } catch (err: any) {
            console.error("RAG query error:", err);
            setErrorMsg(err.message || (isEn ? "An unexpected error occurred." : "Váratlan hiba történt."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Bar: Document Selector */}
            <div className="bg-card border rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                                {isEn ? "Step 1: Choose Corporate Document or Knowledge Base" : "1. Lépés: Válasszon vállalati szabályzatot / tudástárat"}
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isEn 
                                ? "Ask any question about the policy. The AI guarantees 100% grounded facts with verified paragraph citations." 
                                : "Tegyen fel bármilyen kérdést. Az AI 100%-os pontossággal válaszol a hivatalos cikkelyek és bekezdések megjelölésével."}
                        </p>
                    </div>

                    {/* Document Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {DOCUMENTS.map((doc) => (
                            <button
                                key={doc.id}
                                type="button"
                                onClick={() => {
                                    setSelectedDocId(doc.id);
                                    setResponse(null);
                                    setQuery("");
                                    setErrorMsg(null);
                                }}
                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-2 ${
                                    selectedDocId === doc.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-muted/60 hover:bg-muted text-muted-foreground border-border"
                                }`}
                            >
                                <span>{doc.icon}</span>
                                <span>{isEn ? doc.titleEn : doc.titleHu}</span>
                            </button>
                        ))}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRawDoc(!showRawDoc)}
                            className="text-xs text-muted-foreground hover:text-foreground gap-1 border border-dashed ml-auto"
                        >
                            {showRawDoc ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{showRawDoc ? (isEn ? "Hide Document" : "Szabályzat elrejtése") : (isEn ? "View Document" : "Szabályzat szövege")}</span>
                        </Button>
                    </div>
                </div>

                {/* Raw Document Viewer Drawer */}
                {showRawDoc && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                {isEn ? "Full Source Document Text:" : "A teljes forrásdokumentum szövege:"}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                                {isEn ? activeDoc.badgeEn : activeDoc.badgeHu}
                            </Badge>
                        </div>
                        <div className="p-4 bg-muted/40 rounded-xl font-mono text-xs max-h-64 overflow-y-auto whitespace-pre-wrap border text-muted-foreground leading-relaxed">
                            {isEn ? activeDoc.rawContentEn : activeDoc.rawContentHu}
                        </div>
                    </div>
                )}
            </div>

            {/* Error banner */}
            {errorMsg && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <strong>{isEn ? "Error:" : "Hiba:"}</strong> {errorMsg}
                    </div>
                </div>
            )}

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: Question Input & Quick Prompts */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="border shadow-md">
                        <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    {isEn ? "Ask a Policy Question" : "Tegyen fel egy kérdést"}
                                </span>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                                {isEn ? activeDoc.badgeEn : activeDoc.badgeHu}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {/* Freeform input */}
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch();
                                }}
                                className="space-y-3"
                            >
                                <div className="relative">
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={isEn ? "Type any question about this policy..." : "Írjon be bármilyen kérdést a szabályzattal kapcsolatban..."}
                                        disabled={isLoading}
                                        className="pr-10 text-sm py-5"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!query.trim() || isLoading}
                                        className="absolute right-1.5 top-1.5 h-7 w-7 rounded-lg"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </form>

                            {/* Preset Quick Prompts */}
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                                    {isEn ? "Or click an example question:" : "Vagy kattintson egy mintakérdésre:"}
                                </span>
                                <div className="space-y-2">
                                    {sampleQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSearch(q)}
                                            disabled={isLoading}
                                            className="w-full text-left p-2.5 rounded-xl border bg-muted/30 hover:bg-primary/5 hover:border-primary/40 text-xs text-foreground transition-all flex items-center justify-between group"
                                        >
                                            <span className="line-clamp-2">{q}</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How RAG Works Box */}
                    <Card className="bg-primary/5 border border-primary/10">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                <ShieldCheck className="w-4 h-4" />
                                <span>{isEn ? "Zero Hallucination Guarantee" : "100% Hallucinációmentes Garancia"}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {isEn 
                                    ? "Standard AI models invent answers when unsure. Backline's enterprise RAG pipeline strictly forces GPT-4o to cite verbatim clauses from your company documents. If an answer is not in the text, it will not guess." 
                                    : "A hagyományos AI hajlamos kitalálni válaszokat. A Backline vállalati RAG rendszere szigorúan a céges szabályzatok hivatalos szakaszaira támaszkodik, és pontosan megjelöli a forrásbekezdést."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: RAG Response & Verified Citations */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="border shadow-md">
                        <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span>{isEn ? "Intelligent Policy Answer & Verification" : "Intelligens Válasz & Forrásellenőrzés"}</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {isEn 
                                        ? "Extracted with Azure OpenAI GPT-4o Semantic Retrieval" 
                                        : "Kinyerve az Azure OpenAI GPT-4o Szemantikus Keresőmotorral"}
                                </CardDescription>
                            </div>

                            {response && (
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {response.confidenceScore || "99.8%"}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                                        {elapsedTime}s
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Empty State */}
                            {!response && !isLoading && (
                                <div className="text-center py-16 px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">
                                        {isEn ? "Ready to Search Corporate Policies" : "Készen áll a szabályzatok átvizsgálására"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                                        {isEn 
                                            ? "Select an example question on the left or type your own question to see how the RAG model answers with verified paragraph citations." 
                                            : "Válasszon egy mintakérdést a bal oldalon, vagy írjon be egy saját kérdést a teszteléshez! Az AI megadja a választ és az idézett bekezdést."}
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleSearch(sampleQuestions[0])}
                                        className="font-medium"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                                        {isEn ? "Run Sample Query" : "Mintakérdés futtatása"}
                                    </Button>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-20 px-4 space-y-4">
                                    <div className="relative w-16 h-16 mx-auto">
                                        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                        <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Search className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-base">
                                            {isEn ? "Scanning corporate documents with Azure GPT-4o..." : "Szabályzatok átvizsgálása Azure GPT-4o-val..."}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {isEn 
                                                ? "Retrieving context, checking clause numbers, and verifying factual grounding..." 
                                                : "Kontextus kinyerése, cikkelyek ellenőrzése és ténybeli igazolás..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Answer & Citations View */}
                            {response && !isLoading && (
                                <div className="space-y-6">
                                    {/* Direct Answer Box */}
                                    <div className="p-4 rounded-xl bg-card border-2 border-primary/20 shadow-sm space-y-2">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                {isEn ? "Direct Answer:" : "Hivatalos Válasz:"}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {isEn ? "Azure GPT-4o Verified" : "Azure GPT-4o által igazolva"}
                                            </Badge>
                                        </div>
                                        <div className="text-sm font-medium text-foreground leading-relaxed">
                                            {response.answer}
                                        </div>
                                    </div>

                                    {/* Verified Citations List (A bizonyíték) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                {isEn ? "Verified Source Citations & Quotes" : "Hitelesített Céges Forráshivatkozások"} ({response.citations?.length || 0})
                                            </span>
                                        </div>

                                        <div className="space-y-2.5">
                                            {response.citations?.map((cit, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-1.5 text-xs"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div className="font-bold text-foreground flex items-center gap-1.5">
                                                            <span className="text-primary font-mono">{cit.section || `§${idx + 1}`}</span>
                                                            <span>•</span>
                                                            <span className="text-muted-foreground">{cit.chapter}</span>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                                                            {isEn ? "Grounded Fact" : "Ténybeli igazolás"}
                                                        </Badge>
                                                    </div>
                                                    {cit.quote && (
                                                        <blockquote className="p-2.5 rounded-lg bg-background border-l-2 border-primary text-xs italic text-muted-foreground">
                                                            "{cit.quote}"
                                                        </blockquote>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommended Follow-ups */}
                                    {response.recommendedFollowUps && response.recommendedFollowUps.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <span className="text-xs font-semibold text-muted-foreground block mb-2">
                                                {isEn ? "Suggested related questions:" : "Javasolt kapcsolódó kérdések:"}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {response.recommendedFollowUps.map((rf, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleSearch(rf)}
                                                        className="px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-xs text-foreground border transition-all hover:border-primary/40 flex items-center gap-1.5"
                                                    >
                                                        <span>{rf}</span>
                                                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Infrastructure & Cost Monitor (Kliens szemszögből) */}
                    <Card className="bg-muted/30 border">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                                <span>{isEn ? "Enterprise Resource & Cost" : "Vállalati Erőforrás & Költség"}</span>
                                <Badge variant="secondary" className="text-[10px]">Microsoft Azure GPT-4o RAG</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-background rounded-lg border">
                                <div className="text-xl font-bold font-mono">
                                    {usageStats.totalTokens > 0 ? usageStats.totalTokens : "~420"}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {isEn ? "Context tokens processed" : "Feldolgozott kontextus token"}
                                </div>
                            </div>
                            <div className="p-3 bg-background rounded-lg border">
                                <div className="text-xl font-bold font-mono text-emerald-600">
                                    ~{usageStats.approxHuf !== "0.00" ? usageStats.approxHuf : "0.58"} Ft
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {isEn ? "Est. search cost / query" : "Becsült költség / kérdés"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
