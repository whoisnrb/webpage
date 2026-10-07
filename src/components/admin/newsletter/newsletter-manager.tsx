"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Mail,
    Users,
    Send,
    Sparkles,
    Plus,
    Download,
    RefreshCw,
    Trash2,
    CheckCircle2,
    XCircle,
    Smartphone,
    Monitor,
    FileText,
    Loader2,
    Eye,
    Save,
    Search,
    Clock,
    AlertCircle,
    Check,
    ExternalLink,
} from "lucide-react";
import {
    addSubscriber,
    toggleSubscriberStatus,
    deleteSubscriber,
    syncSubscribersFromSheet,
    saveNewsletterCampaign,
    deleteNewsletterCampaign,
    generateNewsletterAI,
    sendNewsletterCampaign,
} from "@/app/actions/newsletter";
import { buildNewsletterHtml } from "@/lib/newsletter-template";

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    active: boolean;
    source: string;
    createdAt: Date | string;
}

interface Campaign {
    id: string;
    subject: string;
    previewText: string | null;
    content: string;
    status: string;
    recipientCount: number;
    sentAt: Date | string | null;
    createdAt: Date | string;
}

interface Props {
    initialSubscribers: Subscriber[];
    initialCampaigns: Campaign[];
    userEmail?: string;
}

export function NewsletterManager({
    initialSubscribers,
    initialCampaigns,
    userEmail = "whoisnrb@gmail.com",
}: Props) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [activeTab, setActiveTab] = useState<string>("subscribers");

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Composer states
    const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
    const [subject, setSubject] = useState("Heti IT & Automatizációs Tippek a BacklineIT-tól 🚀");
    const [previewText, setPreviewText] = useState("Hogyan növelheted céged hatékonyságát automatizációval ezen a héten?");
    const [content, setContent] = useState(
        `<p>Kedves Ügyfelünk és Érdeklődőnk!</p>\n<p>Összegyűjtöttük a hét legfontosabb informatikai és folyamatautomatizációs tanácsait, amelyekkel értékes munkaórákat spórolhatsz meg csapatodnak.</p>\n<h2>1. Manuális folyamatok megszüntetése</h2>\n<p>Gyakran tapasztaljuk, hogy a cégek órákat töltenek számlák kézi rögzítésével vagy megrendelések másolgatásával. Egy jól felépített n8n vagy API integrációval ezek a lépések másodpercek alatt, emberi hiba nélkül lefutnak.</p>\n<h2>2. Adatbiztonság és mentések</h2>\n<p>Mikor ellenőrizted utoljára a mentéseid visszaállíthatóságát? A katasztrófahelyzetek 80%-a megelőzhető egy automatizált, ellenőrzött biztonsági mentési stratégiával.</p>\n<p>Ha kérdésed van a bevezetéssel vagy a rendszereid optimalizálásával kapcsolatban, szakértő csapatunk készséggel áll rendelkezésedre.</p>`
    );
    const [ctaText, setCtaText] = useState("Ingyenes konzultáció foglalása");
    const [ctaUrl, setCtaUrl] = useState("https://backlineit.hu/konzultacio");
    const [testEmail, setTestEmail] = useState(userEmail);
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    // Action loaders
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiTopic, setAiTopic] = useState("");
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [isSendingAll, setIsSendingAll] = useState(false);
    const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

    // Filtered Subscribers
    const filteredSubscribers = useMemo(() => {
        return subscribers.filter((sub) => {
            const matchesQuery =
                sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()));

            if (statusFilter === "ACTIVE") return matchesQuery && sub.active;
            if (statusFilter === "INACTIVE") return matchesQuery && !sub.active;
            return matchesQuery;
        });
    }, [subscribers, searchQuery, statusFilter]);

    // Active count
    const activeSubscribersCount = useMemo(() => {
        return subscribers.filter((s) => s.active).length;
    }, [subscribers]);

    // HTML Preview String
    const renderedPreviewHtml = useMemo(() => {
        return buildNewsletterHtml({
            subject: subject || "Hírlevél előnézet",
            previewText: previewText || "",
            content: content || "<p>Írj be tartalmat az előnézethez...</p>",
            ctaText: ctaText || undefined,
            ctaUrl: ctaUrl || undefined,
            recipientEmail: "pelda@ugyfel.hu",
        });
    }, [subject, previewText, content, ctaText, ctaUrl]);

    // --- Subscriber Handlers ---

    const handleAddSubscriber = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes("@")) {
            toast.error("Kérlek adj meg egy érvényes e-mail címet!");
            return;
        }

        setIsAdding(true);
        try {
            const res = await addSubscriber(newEmail, newName);
            if (res.success && res.subscriber) {
                toast.success("Feliratkozó sikeresen hozzáadva!");
                setSubscribers((prev) => [
                    res.subscriber as any,
                    ...prev.filter((s) => s.email !== res.subscriber.email),
                ]);
                setNewEmail("");
                setNewName("");
                setIsAddModalOpen(false);
            } else {
                toast.error(res.error || "Hiba történt a hozzáadáskor.");
            }
        } catch {
            toast.error("Váratlan hiba történt.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleStatus = async (id: string, currentActive: boolean) => {
        const newStatus = !currentActive;
        try {
            const res = await toggleSubscriberStatus(id, newStatus);
            if (res.success) {
                setSubscribers((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, active: newStatus } : s))
                );
                toast.success(newStatus ? "Feliratkozó aktiválva" : "Feliratkozó inaktiválva");
            } else {
                toast.error(res.error || "Hiba a státusz módosításakor");
            }
        } catch {
            toast.error("Váratlan hiba történt");
        }
    };

    const handleDeleteSubscriber = async () => {
        if (!deleteSubId) return;
        try {
            const res = await deleteSubscriber(deleteSubId);
            if (res.success) {
                setSubscribers((prev) => prev.filter((s) => s.id !== deleteSubId));
                toast.success("Feliratkozó törölve.");
            } else {
                toast.error(res.error || "Nem sikerült törölni.");
            }
        } catch {
            toast.error("Váratlan hiba történt");
        } finally {
            setDeleteSubId(null);
        }
    };

    const handleSyncSheet = async () => {
        setIsSyncing(true);
        try {
            const res = await syncSubscribersFromSheet();
            if (res.success) {
                toast.success(
                    res.addedCount && res.addedCount > 0
                        ? `${res.addedCount} új feliratkozó importálva a Google Sheet-ből!`
                        : "A lista már teljesen naprakész a Google Sheet-tel!"
                );
                // Refresh list
                window.location.reload();
            } else {
                toast.error(res.error || "Szinkronizálási hiba");
            }
        } catch {
            toast.error("Váratlan hiba történt");
        } finally {
            setIsSyncing(false);
        }
    };

    const exportToCSV = () => {
        const headers = ["Email", "Név", "Státusz", "Forrás", "Dátum"];
        const rows = subscribers.map((s) => [
            s.email,
            s.name || "",
            s.active ? "Aktív" : "Inaktív",
            s.source,
            new Date(s.createdAt).toISOString().split("T")[0],
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `backlineit_hirlevel_feliratkozok_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV sikeresen letöltve!");
    };

    // --- Composer Handlers ---

    const handleGenerateAI = async () => {
        if (!aiTopic.trim()) {
            toast.error("Kérlek adj meg egy témát vagy címszavakat!");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const res = await generateNewsletterAI({ topic: aiTopic });
            if (res.success && res.data) {
                setSubject(res.data.subject);
                setPreviewText(res.data.previewText);
                setContent(res.data.content);
                if (res.data.ctaText) setCtaText(res.data.ctaText);
                if (res.data.ctaUrl) setCtaUrl(res.data.ctaUrl);
                toast.success("Hírlevél sikeresen legenerálva a Gemini AI segítségével! ✨");
            } else {
                toast.error(res.error || "Hiba a generálás során.");
            }
        } catch {
            toast.error("Nem sikerült elérni az AI szolgáltatást.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!subject.trim()) {
            toast.error("A tárgymező megadása kötelező!");
            return;
        }

        setIsSavingDraft(true);
        try {
            const res = await saveNewsletterCampaign({
                id: currentCampaignId || undefined,
                subject,
                previewText,
                content,
                status: "DRAFT",
            });

            if (res.success && res.campaign) {
                setCurrentCampaignId(res.campaign.id);
                setCampaigns((prev) => [
                    res.campaign as any,
                    ...prev.filter((c) => c.id !== res.campaign.id),
                ]);
                toast.success("Piszkozat sikeresen elmentve!");
            } else {
                toast.error(res.error || "Nem sikerült elmenteni a piszkozatot.");
            }
        } catch {
            toast.error("Váratlan hiba mentéskor");
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail || !testEmail.includes("@")) {
            toast.error("Adj meg egy érvényes teszt e-mail címet!");
            return;
        }
        if (!subject.trim() || !content.trim()) {
            toast.error("Töltsd ki a tárgyat és a tartalmat tesztküldés előtt!");
            return;
        }

        setIsSendingTest(true);
        try {
            const res = await sendNewsletterCampaign({
                campaignId: currentCampaignId || undefined,
                subject,
                previewText,
                content,
                ctaText,
                ctaUrl,
                testEmail,
            });

            if (res.success) {
                toast.success(res.message || `Teszt levél sikeresen elküldve ide: ${testEmail}`);
            } else {
                toast.error(res.error || "Hiba történt a tesztküldés során.");
            }
        } catch {
            toast.error("Nem sikerült elküldeni a teszt e-mailt.");
        } finally {
            setIsSendingTest(false);
        }
    };

    const handleSendAll = async () => {
        setIsSendingAll(true);
        try {
            const res = await sendNewsletterCampaign({
                campaignId: currentCampaignId || undefined,
                subject,
                previewText,
                content,
                ctaText,
                ctaUrl,
            });

            if (res.success) {
                toast.success(res.message || "A hírlevél sikeresen kiküldve mindenkinek!");
                setIsSendConfirmOpen(false);
                // Refresh campaigns
                if (currentCampaignId) {
                    setCampaigns((prev) =>
                        prev.map((c) =>
                            c.id === currentCampaignId
                                ? { ...c, status: "SENT", recipientCount: res.count ?? 0, sentAt: new Date() }
                                : c
                        )
                    );
                }
            } else {
                toast.error(res.error || "Hiba a kiküldés során.");
            }
        } catch {
            toast.error("Váratlan hiba a tömeges küldés során.");
        } finally {
            setIsSendingAll(false);
        }
    };

    const loadCampaignToEditor = (camp: Campaign) => {
        setCurrentCampaignId(camp.id);
        setSubject(camp.subject);
        setPreviewText(camp.previewText || "");
        setContent(camp.content);
        setActiveTab("composer");
        toast.info("Kampány betöltve a szerkesztőbe!");
    };

    const handleDeleteCampaign = async (id: string) => {
        try {
            const res = await deleteNewsletterCampaign(id);
            if (res.success) {
                setCampaigns((prev) => prev.filter((c) => c.id !== id));
                if (currentCampaignId === id) setCurrentCampaignId(null);
                toast.success("Kampány törölve.");
            } else {
                toast.error(res.error || "Hiba a törléskor");
            }
        } catch {
            toast.error("Váratlan hiba történt");
        }
    };

    // Quick formatting helpers for textarea
    const insertTag = (openTag: string, closeTag: string) => {
        setContent((prev) => `${prev}\n${openTag}${closeTag}`);
    };

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0b1329] to-[#040817] border border-cyan-500/20 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                                BacklineIT Hírlevél Motor
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                            Hírlevél Központ
                        </h1>
                        <p className="mt-2 text-sm text-slate-400 max-w-xl">
                            Kezeld a heti hírlevélre feliratkozott érdeklődőket, fogalmazz meg prémium kampányokat AI támogatással, és küldd ki közvetlenül a Gmail szerveredről!
                        </p>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-[#090e1c]/80 border border-white/5 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{subscribers.length}</div>
                            <div className="text-[11px] text-slate-400 font-medium">Összes feliratkozó</div>
                        </div>
                        <div className="bg-[#090e1c]/80 border border-cyan-500/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-cyan-400">{activeSubscribersCount}</div>
                            <div className="text-[11px] text-cyan-300/80 font-medium">Aktív címzett</div>
                        </div>
                        <div className="bg-[#090e1c]/80 border border-white/5 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-emerald-400">
                                {campaigns.filter((c) => c.status === "SENT").length}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">Kiküldött levél</div>
                        </div>
                        <div className="bg-[#090e1c]/80 border border-white/5 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-amber-400">
                                {campaigns.filter((c) => c.status === "DRAFT").length}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">Piszkozat</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#080d1a] border border-white/10 p-1 rounded-xl">
                    <TabsTrigger
                        value="subscribers"
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                        <Users className="h-4 w-4" />
                        Feliratkozók ({subscribers.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="composer"
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                        <Mail className="h-4 w-4" />
                        Hírlevél Szerkesztő & Küldő
                    </TabsTrigger>
                    <TabsTrigger
                        value="campaigns"
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                        <Clock className="h-4 w-4" />
                        Előzmények & Piszkozatok ({campaigns.length})
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: SUBSCRIBERS */}
                <TabsContent value="subscribers" className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#090d19] border border-white/5 p-4 rounded-xl">
                        {/* Search & Filter */}
                        <div className="flex flex-1 items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Keresés e-mail vagy név alapján..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-[#050811] border-white/10 text-white placeholder:text-slate-500 text-sm h-10"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={(val: any) => setStatusFilter(val)}
                            >
                                <SelectTrigger className="w-[150px] bg-[#050811] border-white/10 text-sm h-10 text-slate-300">
                                    <SelectValue placeholder="Státusz szűrő" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0b1122] border-white/10 text-slate-200">
                                    <SelectItem value="ALL">Összes feliratkozó</SelectItem>
                                    <SelectItem value="ACTIVE">Csak aktívak</SelectItem>
                                    <SelectItem value="INACTIVE">Csak inaktívak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSyncSheet}
                                disabled={isSyncing}
                                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-2 h-10"
                            >
                                <RefreshCw className={`h-4 w-4 text-cyan-400 ${isSyncing ? "animate-spin" : ""}`} />
                                <span className="hidden md:inline">Google Sheet Szinkron</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToCSV}
                                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-2 h-10"
                            >
                                <Download className="h-4 w-4 text-cyan-400" />
                                <span className="hidden md:inline">CSV Export</span>
                            </Button>

                            <Button
                                size="sm"
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold gap-2 h-10"
                            >
                                <Plus className="h-4 w-4" />
                                Új feliratkozó
                            </Button>
                        </div>
                    </div>

                    {/* Subscribers Table */}
                    <div className="rounded-xl border border-white/5 bg-[#080d1a] overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#0b1224]/80">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">E-mail cím</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Név</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Forrás</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Dátum</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Státusz</TableHead>
                                    <TableHead className="text-right text-slate-400 font-semibold text-xs uppercase">Művelet</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubscribers.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                                            Nem található feliratkozó a megadott feltételekkel.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSubscribers.map((sub) => (
                                        <TableRow key={sub.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-medium text-white flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5 text-cyan-400/70 shrink-0" />
                                                <span>{sub.email}</span>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {sub.name || <span className="text-slate-600 italic">Nincs megadva</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-white/5 text-slate-300 border-white/10 text-xs font-normal"
                                                >
                                                    {sub.source === "website"
                                                        ? "Weboldal"
                                                        : sub.source === "google-sheet-import"
                                                        ? "Google Sheet"
                                                        : sub.source === "admin-manual"
                                                        ? "Kézi rögzítés"
                                                        : sub.source}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {new Date(sub.createdAt).toLocaleDateString("hu-HU", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={sub.active}
                                                        onCheckedChange={() => handleToggleStatus(sub.id, sub.active)}
                                                        className="data-[state=checked]:bg-cyan-500"
                                                    />
                                                    <span
                                                        className={`text-xs font-medium ${
                                                            sub.active ? "text-emerald-400" : "text-slate-500"
                                                        }`}
                                                    >
                                                        {sub.active ? "Aktív" : "Inaktív"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteSubId(sub.id)}
                                                    className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* TAB 2: NEWSLETTER COMPOSER */}
                <TabsContent value="composer" className="space-y-6">
                    {/* AI Generator Bar */}
                    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/50 via-[#0a1226] to-[#0d162d] p-5">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        Gemini AI Hírlevél Író Asszisztens
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Adj meg egy témát, és a mesterséges intelligencia pillanatok alatt megírja a teljes hírlevelet tárggyal és felépítéssel.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-1 max-w-md items-center gap-2">
                                <Input
                                    placeholder="Pl.: Hogyan takaríthat meg 10 órát egy KKV n8n-nel..."
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                    className="bg-[#050914] border-cyan-500/20 text-white placeholder:text-slate-500 text-sm h-10"
                                />
                                <Button
                                    onClick={handleGenerateAI}
                                    disabled={isGeneratingAI}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-10 px-4 shrink-0 gap-2"
                                >
                                    {isGeneratingAI ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                    <span>Generálás</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 2-Column Grid: Editor Left, Live Preview Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* LEFT COLUMN: EDITOR */}
                        <div className="space-y-5 bg-[#080d1a] border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-cyan-400" />
                                    <h3 className="text-base font-semibold text-white">Levél paraméterek</h3>
                                </div>
                                {currentCampaignId && (
                                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                                        Mentett kampány szerkesztése
                                    </Badge>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                                    E-mail Tárgy (Subject) *
                                </label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Pl. Heti IT és Automatizációs Hírek a BacklineIT-tól"
                                    className="bg-[#050812] border-white/10 text-white text-sm"
                                />
                            </div>

                            {/* Preheader */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                                    Előnézeti szöveg (Preheader)
                                </label>
                                <Input
                                    value={previewText}
                                    onChange={(e) => setPreviewText(e.target.value)}
                                    placeholder="Rövid felvezető, ami az email kliensekben a tárgy után látszik..."
                                    className="bg-[#050812] border-white/10 text-white text-sm"
                                />
                            </div>

                            {/* Content & Toolbar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                                        Levél Tartalma (HTML / Szöveg) *
                                    </label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => insertTag("<h2>", "Alcím</h2>")}
                                            className="text-[11px] px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 border border-white/5"
                                        >
                                            Alcím
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertTag("<strong>", "Kiemelés</strong>")}
                                            className="text-[11px] px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 border border-white/5"
                                        >
                                            Félkövér
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertTag("<ul>\n  <li>", "Első pont</li>\n  <li>Második pont</li>\n</ul>")}
                                            className="text-[11px] px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 border border-white/5"
                                        >
                                            Felsorolás
                                        </button>
                                    </div>
                                </div>
                                <Textarea
                                    rows={12}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Írd ide a hírlevél tartalmát..."
                                    className="bg-[#050812] border-white/10 text-white text-sm font-mono leading-relaxed"
                                />
                            </div>

                            {/* Call-to-action button settings */}
                            <div className="bg-[#050812] border border-white/5 rounded-xl p-4 space-y-3">
                                <div className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">
                                    Kiemelt Gomb (Call-To-Action)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] text-slate-400">Gomb felirata</label>
                                        <Input
                                            value={ctaText}
                                            onChange={(e) => setCtaText(e.target.value)}
                                            placeholder="Pl. Időpontfoglalás"
                                            className="bg-[#0a0f1e] border-white/10 text-white text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400">Gomb hivatkozása (URL)</label>
                                        <Input
                                            value={ctaUrl}
                                            onChange={(e) => setCtaUrl(e.target.value)}
                                            placeholder="https://backlineit.hu/konzultacio"
                                            className="bg-[#0a0f1e] border-white/10 text-white text-sm mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sending controls & Actions */}
                            <div className="pt-2 border-t border-white/5 space-y-4">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleSaveDraft}
                                        disabled={isSavingDraft}
                                        className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>{isSavingDraft ? "Mentés..." : "Piszkozat mentése"}</span>
                                    </Button>

                                    <Button
                                        onClick={() => setIsSendConfirmOpen(true)}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Kiküldés mindenkinek ({activeSubscribersCount} címzett)</span>
                                    </Button>
                                </div>

                                {/* Test Send Box */}
                                <div className="bg-[#060b17] border border-cyan-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-2">
                                    <Input
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="Teszt e-mail cím..."
                                        className="bg-[#03060f] border-white/10 text-white text-sm h-9 flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSendTest}
                                        disabled={isSendingTest}
                                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 gap-1.5 h-9 shrink-0"
                                    >
                                        {isSendingTest ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Send className="h-3.5 w-3.5" />
                                        )}
                                        <span>Teszt levél küldése</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE PREVIEW */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-[#080d1a] border border-white/5 px-4 py-3 rounded-xl">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                                    <Eye className="h-4 w-4 text-cyan-400" />
                                    <span>Valós idejű e-mail előnézet</span>
                                </div>
                                <div className="flex items-center gap-1 bg-[#050812] border border-white/5 p-1 rounded-lg">
                                    <button
                                        onClick={() => setPreviewDevice("desktop")}
                                        className={`p-1.5 rounded ${
                                            previewDevice === "desktop"
                                                ? "bg-cyan-500/20 text-cyan-300"
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <Monitor className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewDevice("mobile")}
                                        className={`p-1.5 rounded ${
                                            previewDevice === "mobile"
                                                ? "bg-cyan-500/20 text-cyan-300"
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Preview Frame */}
                            <div
                                className={`mx-auto transition-all duration-300 rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-[#060913] ${
                                    previewDevice === "mobile" ? "max-w-[390px]" : "w-full"
                                }`}
                            >
                                <div className="bg-[#0b1020] border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
                                    <div className="truncate max-w-[280px]">
                                        <span className="text-slate-500">Tárgy:</span>{" "}
                                        <span className="text-slate-200 font-medium">{subject || "(Nincs tárgy)"}</span>
                                    </div>
                                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                                        BacklineIT
                                    </span>
                                </div>

                                <div className="h-[620px] overflow-y-auto">
                                    <iframe
                                        title="Newsletter Preview"
                                        srcDoc={renderedPreviewHtml}
                                        className="w-full h-full border-none"
                                        sandbox="allow-same-origin"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 3: CAMPAIGNS & HISTORY */}
                <TabsContent value="campaigns" className="space-y-4">
                    <div className="rounded-xl border border-white/5 bg-[#080d1a] overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#0b1224]/80">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Tárgy</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Státusz</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Címzettek</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-xs uppercase">Létrehozva / Kiküldve</TableHead>
                                    <TableHead className="text-right text-slate-400 font-semibold text-xs uppercase">Műveletek</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                                            Még nincs mentett vagy kiküldött hírlevél kampányod.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    campaigns.map((camp) => (
                                        <TableRow key={camp.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="font-semibold text-white">
                                                <div>{camp.subject}</div>
                                                {camp.previewText && (
                                                    <div className="text-xs text-slate-400 font-normal truncate max-w-md mt-0.5">
                                                        {camp.previewText}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {camp.status === "SENT" ? (
                                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                                        Kiküldve
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                                                        Piszkozat
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-300 text-sm">
                                                {camp.recipientCount > 0 ? `${camp.recipientCount} fő` : "-"}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {camp.sentAt
                                                    ? new Date(camp.sentAt).toLocaleDateString("hu-HU", {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : new Date(camp.createdAt).toLocaleDateString("hu-HU")}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => loadCampaignToEditor(camp)}
                                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-8"
                                                >
                                                    Szerkesztés
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteCampaign(camp.id)}
                                                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODAL: ADD SUBSCRIBER */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="bg-[#0b1222] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Új hírlevél feliratkozó hozzáadása</DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Adj meg egy új e-mail címet a heti hírlevél listához.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubscriber} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-300">E-mail cím *</label>
                            <Input
                                type="email"
                                required
                                placeholder="pelda@ugyfel.hu"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-[#050811] border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-300">Név (opcionális)</label>
                            <Input
                                placeholder="Kovács János"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-[#050811] border-white/10 text-white"
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-slate-400"
                            >
                                Mégse
                            </Button>
                            <Button
                                type="submit"
                                disabled={isAdding}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                            >
                                {isAdding ? "Mentés..." : "Hozzáadás"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: CONFIRM DELETE SUBSCRIBER */}
            <Dialog open={!!deleteSubId} onOpenChange={() => setDeleteSubId(null)}>
                <DialogContent className="bg-[#0b1222] border-white/10 text-white sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-400">
                            <AlertCircle className="h-5 w-5" />
                            Feliratkozó törlése
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Biztosan véglegesen törölni szeretnéd ezt a feliratkozót a listából?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button variant="ghost" onClick={() => setDeleteSubId(null)} className="text-slate-400">
                            Mégse
                        </Button>
                        <Button
                            onClick={handleDeleteSubscriber}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                        >
                            Törlés
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: CONFIRM SEND TO ALL */}
            <Dialog open={isSendConfirmOpen} onOpenChange={setIsSendConfirmOpen}>
                <DialogContent className="bg-[#0b1222] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-cyan-400">
                            <Send className="h-5 w-5" />
                            Hírlevél kiküldésének megerősítése
                        </DialogTitle>
                        <DialogDescription className="text-slate-300 text-sm pt-2">
                            Biztosan ki szeretnéd küldeni a(z) <strong className="text-white font-semibold">"{subject}"</strong> című hírlevelet az összes (<strong>{activeSubscribersCount}</strong>) aktív feliratkozónak?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                        ⚠️ A levelek a rendszer Gmail fiókján keresztül közvetlenül elküldésre kerülnek a címzetteknek.
                    </div>
                    <DialogFooter className="pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsSendConfirmOpen(false)}
                            className="text-slate-400"
                        >
                            Mégse
                        </Button>
                        <Button
                            onClick={handleSendAll}
                            disabled={isSendingAll}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold gap-2"
                        >
                            {isSendingAll ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Küldés folyamatban...</span>
                                </>
                            ) : (
                                <span>Igen, kiküldés most</span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
