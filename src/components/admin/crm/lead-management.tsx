"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateLead, deleteLead, createLead, sendOutreachEmailAction, generateAiLeadPitchAction, searchLiveLeadsAction, importHuntedLeadAction, analyzeFacebookLeadAction, type HuntedLead } from "@/app/actions/crm";
import { toast } from "sonner";
import {
    Users,
    UserCheck,
    FileText,
    TrendingUp,
    Search,
    Plus,
    MoreVertical,
    Pencil,
    Trash2,
    CalendarCheck,
    Mail,
    Building2,
    Copy,
    Sparkles,
    ArrowUpRight,
    Send,
    ExternalLink,
    MessageSquare,
    Loader2,
    CheckCircle2,
    Share2,
    Check,
    Target,
    Compass,
    Globe,
    Building,
    Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDistanceToNow } from "date-fns";
import { hu } from "date-fns/locale";

interface Lead {
    id: string;
    name: string | null;
    companyName: string | null;
    email: string;
    status: string;
    source: string;
    notes: string | null;
    lastContactedAt: Date | null;
    createdAt: Date;
}

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; dotColor: string; borderColor: string }> = {
    LEAD: {
        label: "Lead",
        color: "text-cyan-300",
        bgColor: "bg-cyan-500/10",
        dotColor: "bg-cyan-400",
        borderColor: "border-cyan-500/20",
    },
    AJÁNLAT: {
        label: "Ajánlat",
        color: "text-amber-300",
        bgColor: "bg-amber-500/10",
        dotColor: "bg-amber-400",
        borderColor: "border-amber-500/20",
    },
    AKTÍV: {
        label: "Aktív",
        color: "text-emerald-300",
        bgColor: "bg-emerald-500/10",
        dotColor: "bg-emerald-400",
        borderColor: "border-emerald-500/20",
    },
    INAKTÍV: {
        label: "Inaktív",
        color: "text-slate-400",
        bgColor: "bg-slate-500/10",
        dotColor: "bg-slate-400",
        borderColor: "border-slate-500/20",
    },
};

// Avatar colors based on status
const AVATAR_COLORS: Record<string, string> = {
    LEAD: "from-cyan-500/30 to-blue-600/30 text-cyan-300",
    AJÁNLAT: "from-amber-500/30 to-orange-600/30 text-amber-300",
    AKTÍV: "from-emerald-500/30 to-green-600/30 text-emerald-300",
    INAKTÍV: "from-slate-500/30 to-gray-600/30 text-slate-400",
};

// ─── KPI Stat Card ──────────────────────────────────────────────
function StatCard({
    icon: Icon,
    label,
    value,
    accentColor,
    glowColor,
    index,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    accentColor: string;
    glowColor: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-500"
        >
            {/* Subtle glow */}
            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${glowColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-slate-500 mb-2">{label}</p>
                    <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${accentColor} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.LEAD;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${status === "AKTÍV" ? "animate-pulse" : ""}`} />
            {config.label}
        </span>
    );
}

// ─── Main Component ──────────────────────────────────────────────
export function LeadManagement({ initialLeads }: { initialLeads: Lead[] }) {
    const t = useTranslations("CRM");
    const [leads, setLeads] = useState(initialLeads);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
    const [isOutreachOpen, setIsOutreachOpen] = useState(false);
    const [outreachSubject, setOutreachSubject] = useState("");
    const [outreachIntro, setOutreachIntro] = useState("");
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

    // ─── Lead Hunter States ───────────────────────────────────────
    const [isHunterOpen, setIsHunterOpen] = useState(false);
    const [hunterTab, setHunterTab] = useState<"google" | "facebook" | "linkedin">("google");
    const [hunterCity, setHunterCity] = useState("Budapest");
    const [hunterCategory, setHunterCategory] = useState("Fogászat");
    const [isSearchingLeads, setIsSearchingLeads] = useState(false);
    const [huntedLeads, setHuntedLeads] = useState<HuntedLead[]>([]);
    const [importedLeadEmails, setImportedLeadEmails] = useState<Set<string>>(new Set());

    // Facebook Hunter State
    const [fbPostText, setFbPostText] = useState("");
    const [fbPosterName, setFbPosterName] = useState("");
    const [isAnalyzingFb, setIsAnalyzingFb] = useState(false);
    const [fbAnalysisResult, setFbAnalysisResult] = useState<{ detectedNeed: string; suggestedComment: string } | null>(null);

    // LinkedIn Hunter State
    const [linkedInRole, setLinkedInRole] = useState("Ügyvezető");
    const [linkedInCity, setLinkedInCity] = useState("Budapest");
    const [linkedInIndustry, setLinkedInIndustry] = useState("Webáruház");
    const [liName, setLiName] = useState("");
    const [liCompany, setLiCompany] = useState("");
    const [liEmail, setLiEmail] = useState("");
    const [liUrl, setLiUrl] = useState("");
    const [isSavingLi, setIsSavingLi] = useState(false);
    const [newLead, setNewLead] = useState({
        name: "",
        companyName: "",
        email: "",
        status: "LEAD",
        notes: "",
    });

    // ─── Computed Values ─────────────────────────────────────────
    const stats = useMemo(() => {
        const total = leads.length;
        const active = leads.filter((l) => l.status === "AKTÍV").length;
        const proposals = leads.filter((l) => l.status === "AJÁNLAT").length;
        const rate = total > 0 ? Math.round((active / total) * 100) : 0;
        return { total, active, proposals, rate };
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch =
                searchQuery === "" ||
                (lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, statusFilter]);

    const uniqueSources = useMemo(() => {
        return [...new Set(leads.map((l) => l.source))];
    }, [leads]);

    // ─── Handlers ────────────────────────────────────────────────
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLead) return;

        const result = await updateLead(editingLead.id, {
            name: editingLead.name || undefined,
            companyName: editingLead.companyName || undefined,
            status: editingLead.status,
            notes: editingLead.notes || undefined,
            lastContactedAt: editingLead.lastContactedAt ? new Date(editingLead.lastContactedAt) : undefined,
        });

        if (result.success) {
            toast.success(t("save_success"));
            setIsDialogOpen(false);
            setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? editingLead : l)));
        } else {
            toast.error(t("save_error"));
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLead.email) {
            toast.error("Az e-mail cím megadása kötelező!");
            return;
        }

        const result = await createLead({
            name: newLead.name || undefined,
            companyName: newLead.companyName || undefined,
            email: newLead.email,
            status: newLead.status,
            notes: newLead.notes || undefined,
            source: "Kézi felvitel",
        });

        if (result.success && result.lead) {
            toast.success("Ügyfél sikeresen hozzáadva!");
            setIsCreateDialogOpen(false);
            setLeads((prev) => [result.lead as Lead, ...prev]);
            setNewLead({ name: "", companyName: "", email: "", status: "LEAD", notes: "" });
        } else {
            toast.error(result.error || "Hiba történt a létrehozás során");
        }
    };

    const handleMarkContacted = async (lead: Lead) => {
        const result = await updateLead(lead.id, {
            lastContactedAt: new Date(),
        });
        if (result.success) {
            toast.success("Utolsó kapcsolat frissítve!");
            setLeads((prev) =>
                prev.map((l) => (l.id === lead.id ? { ...l, lastContactedAt: new Date() } : l))
            );
        }
    };

    const handleDelete = async (lead: Lead) => {
        if (confirm("Biztosan törölni szeretné ezt az ügyfelet?")) {
            const res = await deleteLead(lead.id);
            if (res.success) {
                toast.success("Ügyfél törölve!");
                setLeads((prev) => prev.filter((l) => l.id !== lead.id));
            } else {
                toast.error(res.error || "Hiba a törlés során");
            }
        }
    };

    const copyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast.success("E-mail cím másolva!");
    };

    const getInitials = (lead: Lead) => {
        if (lead.companyName) return lead.companyName.charAt(0).toUpperCase();
        if (lead.name) return lead.name.charAt(0).toUpperCase();
        return lead.email.charAt(0).toUpperCase();
    };

    const formatRelativeDate = (date: Date | null) => {
        if (!date) return "—";
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: hu });
        } catch {
            return "—";
        }
    };

    const openOutreach = (lead: Lead) => {
        setOutreachLead(lead);
        const nameOrCompany = lead.companyName || lead.name || "Partnerek";
        setOutreachSubject(`Együttműködés webfejlesztésben – Backline IT & ${nameOrCompany}`);
        const greeting = lead.name ? `Kedves ${lead.name}!` : (lead.companyName ? `Tisztelt ${lead.companyName} Csapat!` : "Üdvözlöm!");
        setOutreachIntro(
            `${greeting}\n\nSzabó Ábel vagyok a Backline IT növekedési és marketing menedzsere. A vállalkozásotok online jelenlétét figyelve úgy látjuk, hogy modern webes és felhő alapú rendszereinkkel érdemben tudnánk támogatni az ügyfélszerzéseteket és a belső digitális folyamataitok automatizálását.`
        );
        setIsOutreachOpen(true);
    };

    const handleGenerateAiPitch = async () => {
        if (!outreachLead) return;
        setIsGeneratingPitch(true);
        try {
            const res = await generateAiLeadPitchAction(outreachLead.id);
            if (res.success && res.intro) {
                setOutreachIntro(res.intro);
                toast.success("AI nyitószöveg sikeresen elkészült (Azure GPT-4o)!");
            } else if (res.fallback) {
                setOutreachIntro(res.fallback);
                toast.info("Alapértelmezett értékesítési sablon betöltve.");
            } else {
                toast.error(res.error || "Nem sikerült az AI szöveg generálása.");
            }
        } catch {
            toast.error("Hiba történt az AI generálás során.");
        } finally {
            setIsGeneratingPitch(false);
        }
    };

    const handleSendOutreachEmail = async () => {
        if (!outreachLead) return;
        setIsSendingEmail(true);
        try {
            const res = await sendOutreachEmailAction(
                outreachLead.id,
                outreachIntro,
                outreachSubject
            );

            if (res.success && res.lead) {
                toast.success("Megkereső e-mail sikeresen elküldve Szabó Ábel nevében!");
                setLeads((prev) =>
                    prev.map((l) => (l.id === outreachLead.id ? (res.lead as Lead) : l))
                );
                setIsOutreachOpen(false);
            } else {
                toast.error(res.error || "Nem sikerült az e-mail elküldése.");
            }
        } catch (err: any) {
            toast.error(err?.message || "Váratlan hiba a küldés során.");
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleCopyLinkedIn = async () => {
        if (!outreachLead) return;
        const nameGreeting = outreachLead.name ? `Szia ${outreachLead.name}!` : "Szia!";
        const target = outreachLead.companyName ? `a ${outreachLead.companyName}` : "a vállalkozásotok";
        const msg = `${nameGreeting} Szabó Ábel vagyok a Backline IT-tól.

Észrevettem ${target} online jelenlétét, és nagyon inspiráló az irány!

A Backline IT-nál (hivatalos Microsoft for Startups partnerek vagyunk) modern, villámgyors egyedi weboldalakat és felhős rendszereket fejlesztünk hazai kkv-knak.
Két dolog, amiben kiemelten tudunk segíteni:
1. Áfamentes számlázás (AAM): Díjainkat nem terheli +27% áfa, így azonnali 27% költségmegtakarítást biztosítunk.
2. 90 napos garancia & Microsoft felhős háttér.

Nézd meg néhány friss munkánkat és élő demónkat itt:
👉 https://backlineit.hu/referenciak

Lenne kedved egy kötetlen 15 perces beszélgetéshez valamikor ezen a héten, hogy átfussuk, hol tudnánk azonnali növekedést hozni nektek?

Üdvözlettel,
Szabó Ábel
szabo.abel@backlineit.hu | Backline IT`;

        await navigator.clipboard.writeText(msg);
        setCopiedChannel("linkedin");
        setTimeout(() => setCopiedChannel(null), 2500);
        toast.success("LinkedIn DM szöveg kimásolva! Megnyitjuk a keresőt...");

        const query = outreachLead.companyName || outreachLead.name || "";
        const searchUrl = query
            ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(query)}`
            : "https://www.linkedin.com";
        window.open(searchUrl, "_blank", "noopener,noreferrer");

        handleMarkContacted(outreachLead);
    };

    const handleCopyFacebook = async () => {
        if (!outreachLead) return;
        const msg = `Szia! Láttam a posztodat a csoportban. Szabó Ábel vagyok a Backline IT-tól (a Microsoft által hivatalosan elismert és támogatott hazai szoftverfejlesztő csapat).

Szívesen segítünk a projekted / weboldalad profi megvalósításában:
✅ Áfamentes számlázás (AAM): Nincs +27% áfa a munkadíjon (27%-kal kedvezőbb ár)
✅ 90 napos teljes körű hibajavítási garancia
✅ Microsoft felhős technológia és villámgyors betöltés

Korábbi munkáinkat és élő demóinkat itt tudod megnézni:
👉 https://backlineit.hu/referenciak

Ha gondolod, írj egy privát üzenetet itt, vagy beszéljünk egy díjmentes 30 perces konzultáción:
📞 https://backlineit.hu/kapcsolat`;

        await navigator.clipboard.writeText(msg);
        setCopiedChannel("facebook");
        setTimeout(() => setCopiedChannel(null), 2500);
        toast.success("Facebook válasz szöveg vágólapra másolva!");

        handleMarkContacted(outreachLead);
    };

    // ─── Lead Hunter Handlers ────────────────────────────────────
    const handleSearchLiveLeads = async () => {
        if (!hunterCity || !hunterCategory) {
            toast.error("Add meg a várost és az iparágot!");
            return;
        }
        setIsSearchingLeads(true);
        try {
            const res = await searchLiveLeadsAction(hunterCity, hunterCategory);
            if (res.success && res.leads) {
                setHuntedLeads(res.leads);
                toast.success(`${res.leads.length} valós vállalkozás megtalálva!`);
            } else {
                toast.error(res.error || "Nem sikerült a leadek lekérése.");
            }
        } catch {
            toast.error("Hiba történt a keresés során.");
        } finally {
            setIsSearchingLeads(false);
        }
    };

    const handleImportHuntedLead = async (item: HuntedLead, openOutreachImmediately = false) => {
        try {
            const res = await importHuntedLeadAction({
                companyName: item.companyName,
                name: item.name || undefined,
                email: item.email,
                source: item.source || "Google Maps Vadász",
                notes: `[Web: ${item.website || 'Nincs'}] [Tel: ${item.phone || 'Nincs'}] ${item.painPoint || ''}`,
            });

            if (res.success && res.lead) {
                setImportedLeadEmails((prev) => new Set(prev).add(item.email.toLowerCase()));
                setLeads((prev) => {
                    if (prev.some((l) => l.id === res.lead.id)) return prev;
                    return [res.lead as Lead, ...prev];
                });
                toast.success(res.alreadyExisted ? "Ügyfél már szerepel a CRM-ben!" : "Lead sikeresen beimportálva a CRM-be!");

                if (openOutreachImmediately) {
                    setIsHunterOpen(false);
                    openOutreach(res.lead as Lead);
                }
            } else {
                toast.error(res.error || "Nem sikerült az importálás.");
            }
        } catch {
            toast.error("Hiba az importálás során.");
        }
    };

    const handleAnalyzeFbPost = async () => {
        if (!fbPostText.trim()) {
            toast.error("Illeszd be a poszt szövegét!");
            return;
        }
        setIsAnalyzingFb(true);
        try {
            const res = await analyzeFacebookLeadAction(fbPostText, fbPosterName);
            if (res.success && res.analysis) {
                setFbAnalysisResult(res.analysis);
                toast.success("Poszt sikeresen elemezve!");

                const dummyEmail = `facebook.${Date.now()}@backlineit-lead.hu`;
                const importRes = await importHuntedLeadAction({
                    companyName: fbPosterName ? `${fbPosterName} (Facebook)` : "Facebook Megkereső",
                    name: fbPosterName || "Facebook Érdeklődő",
                    email: dummyEmail,
                    source: "Facebook Csoport",
                    notes: `[Facebook Poszt]: ${fbPostText.substring(0, 300)}... [Igény]: ${res.analysis.detectedNeed}`,
                });

                if (importRes.success && importRes.lead) {
                    setLeads((prev) => [importRes.lead as Lead, ...prev]);
                }
            }
        } catch {
            toast.error("Hiba a poszt elemzése során.");
        } finally {
            setIsAnalyzingFb(false);
        }
    };

    const handleOpenLinkedInSearch = () => {
        const query = `site:linkedin.com/in/ "${linkedInRole}" "${linkedInCity}" "${linkedInIndustry}"`;
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(googleUrl, "_blank", "noopener,noreferrer");
        toast.info("Google X-Ray keresés megnyitva új lapon!");
    };

    const handleSaveLinkedInLead = async () => {
        if (!liName && !liCompany) {
            toast.error("Adj meg egy nevet vagy cégnevet!");
            return;
        }
        setIsSavingLi(true);
        try {
            const email = liEmail.trim() || `linkedin.${Date.now()}@backlineit-lead.hu`;
            const res = await importHuntedLeadAction({
                companyName: liCompany || undefined,
                name: liName || undefined,
                email: email,
                source: "LinkedIn X-Ray",
                notes: `[LinkedIn Profil]: ${liUrl || 'Nincs megadva'} [Pozíció]: ${linkedInRole} (${linkedInCity})`,
            });

            if (res.success && res.lead) {
                setLeads((prev) => [res.lead as Lead, ...prev]);
                toast.success("LinkedIn lead elmentve a CRM-be!");
                setIsHunterOpen(false);
                openOutreach(res.lead as Lead);
            }
        } catch {
            toast.error("Hiba a mentés során.");
        } finally {
            setIsSavingLi(false);
        }
    };

    // ─── Filter Tabs Config ──────────────────────────────────────
    const filterTabs = [
        { key: "ALL", label: "Összes", count: leads.length },
        { key: "LEAD", label: "Lead", count: leads.filter((l) => l.status === "LEAD").length },
        { key: "AJÁNLAT", label: "Ajánlat", count: leads.filter((l) => l.status === "AJÁNLAT").length },
        { key: "AKTÍV", label: "Aktív", count: leads.filter((l) => l.status === "AKTÍV").length },
        { key: "INAKTÍV", label: "Inaktív", count: leads.filter((l) => l.status === "INAKTÍV").length },
    ];

    return (
        <div className="space-y-6">
            {/* ─── KPI Stats Row ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Összes Lead"
                    value={stats.total}
                    accentColor="bg-gradient-to-br from-cyan-500 to-blue-600"
                    glowColor="bg-cyan-500/20"
                    index={0}
                />
                <StatCard
                    icon={UserCheck}
                    label="Aktív Ügyfelek"
                    value={stats.active}
                    accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
                    glowColor="bg-emerald-500/20"
                    index={1}
                />
                <StatCard
                    icon={FileText}
                    label="Ajánlatok"
                    value={stats.proposals}
                    accentColor="bg-gradient-to-br from-amber-500 to-orange-600"
                    glowColor="bg-amber-500/20"
                    index={2}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Konverziós Ráta"
                    value={`${stats.rate}%`}
                    accentColor="bg-gradient-to-br from-violet-500 to-purple-600"
                    glowColor="bg-violet-500/20"
                    index={3}
                />
            </div>

            {/* ─── Search & Filter Toolbar ──────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-4"
            >
                {/* Search */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Keresés név, cég vagy email alapján..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20 rounded-xl h-10"
                    />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                                ${statusFilter === tab.key
                                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.1)]"
                                    : "bg-white/[0.03] text-slate-400 border border-transparent hover:bg-white/[0.06] hover:text-slate-300"
                                }
                            `}
                        >
                            {tab.key !== "ALL" && (
                                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[tab.key]?.dotColor || "bg-slate-500"}`} />
                            )}
                            {tab.label}
                            <span className={`ml-0.5 text-[10px] ${statusFilter === tab.key ? "text-cyan-400" : "text-slate-600"}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <Button
                        onClick={() => setIsHunterOpen(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 rounded-xl px-5 transition-all duration-300 shrink-0 gap-2 border border-emerald-400/30"
                    >
                        <Compass className="h-4 w-4 text-emerald-200" />
                        <span>🎯 Lead Vadász (Google & Social)</span>
                    </Button>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 rounded-xl px-5 transition-all duration-300 shrink-0"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Új Ügyfél
                    </Button>
                </div>
            </motion.div>

            {/* ─── Data Table ──────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {filteredLeads.length === 0 ? (
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-12">
                        <div className="text-center">
                            <div className="relative mx-auto mb-6 h-20 w-20">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 animate-pulse" />
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-cyan-400/60" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {searchQuery || statusFilter !== "ALL" ? "Nincs találat" : t("no_leads_title")}
                            </h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                                {searchQuery || statusFilter !== "ALL"
                                    ? "Próbálj más keresési feltételt vagy szűrőt."
                                    : t("no_leads_desc")}
                            </p>
                            {(searchQuery || statusFilter !== "ALL") && (
                                <Button
                                    variant="outline"
                                    onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                                    className="border-white/10 text-slate-300 hover:bg-white/5"
                                >
                                    Szűrők törlése
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/[0.06] hover:bg-transparent">
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4 pl-6">
                                        {t("company")} / {t("contact_person")}
                                    </TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4">
                                        {t("email")}
                                    </TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4">
                                        {t("status")}
                                    </TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4">
                                        Forrás
                                    </TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4">
                                        {t("last_contact")}
                                    </TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-bold py-4 text-right pr-6">
                                        Műveletek
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredLeads.map((lead, index) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            transition={{ delay: index * 0.03, duration: 0.3 }}
                                            className="group border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-300"
                                        >
                                            {/* Company + Contact */}
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[lead.status] || AVATAR_COLORS.LEAD} flex items-center justify-center text-sm font-bold shrink-0 border border-white/[0.08]`}>
                                                        {getInitials(lead)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {lead.companyName || "—"}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {lead.name || "Nincs kapcsolattartó"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Email */}
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-1.5 group/email">
                                                    <span className="text-sm text-slate-300 font-mono truncate max-w-[200px]">
                                                        {lead.email}
                                                    </span>
                                                    <button
                                                        onClick={() => copyEmail(lead.email)}
                                                        className="opacity-0 group-hover/email:opacity-100 h-6 w-6 rounded-md flex items-center justify-center hover:bg-white/[0.08] transition-all duration-200"
                                                    >
                                                        <Copy className="h-3 w-3 text-slate-500" />
                                                    </button>
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="py-4">
                                                <StatusBadge status={lead.status} />
                                            </TableCell>

                                            {/* Source */}
                                            <TableCell className="py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                                                    {lead.source}
                                                </span>
                                            </TableCell>

                                            {/* Last Contact */}
                                            <TableCell className="py-4">
                                                <div className="text-sm text-slate-400">
                                                    {formatRelativeDate(lead.lastContactedAt)}
                                                </div>
                                                <div className="text-[11px] text-slate-600">
                                                    Létrehozva: {formatRelativeDate(lead.createdAt)}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="py-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openOutreach(lead)}
                                                        className="h-8 gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg text-xs font-semibold px-2.5 transition-all shadow-sm"
                                                        title="Megkeresés indítása (Email, LinkedIn, FB)"
                                                    >
                                                        <Send className="h-3.5 w-3.5 text-cyan-400" />
                                                        <span className="hidden sm:inline">Megkeresés</span>
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 bg-[#0c1222] border-white/[0.08] rounded-xl shadow-2xl">
                                                            <DropdownMenuItem
                                                                onClick={() => openOutreach(lead)}
                                                                className="text-cyan-300 hover:text-white focus:text-white focus:bg-white/[0.06] rounded-lg cursor-pointer font-medium"
                                                            >
                                                                <Send className="h-4 w-4 mr-2 text-cyan-400" />
                                                                Megkeresés indítása
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => { setEditingLead(lead); setIsDialogOpen(true); }}
                                                                className="text-slate-300 hover:text-white focus:text-white focus:bg-white/[0.06] rounded-lg cursor-pointer"
                                                            >
                                                                <Pencil className="h-4 w-4 mr-2 text-cyan-400" />
                                                                Szerkesztés
                                                            </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleMarkContacted(lead)}
                                                            className="text-slate-300 hover:text-white focus:text-white focus:bg-white/[0.06] rounded-lg cursor-pointer"
                                                        >
                                                            <CalendarCheck className="h-4 w-4 mr-2 text-emerald-400" />
                                                            Megkeresve ma
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => copyEmail(lead.email)}
                                                            className="text-slate-300 hover:text-white focus:text-white focus:bg-white/[0.06] rounded-lg cursor-pointer"
                                                        >
                                                            <Mail className="h-4 w-4 mr-2 text-blue-400" />
                                                            Email másolása
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(lead)}
                                                            className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 rounded-lg cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Törlés
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>

                        {/* Table Footer */}
                        <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.04] bg-white/[0.01]">
                            <p className="text-xs text-slate-500">
                                <span className="text-slate-400 font-medium">{filteredLeads.length}</span> / {leads.length} találat
                            </p>
                            <div className="flex items-center gap-2">
                                {uniqueSources.slice(0, 3).map((source) => (
                                    <span key={source} className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-white/[0.02]">
                                        {source}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ─── Create Dialog ────────────────────────────────── */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[540px] bg-[#0a0f1e] border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-0">
                    {/* Dialog Header */}
                    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border-b border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">Új Ügyfél Hozzáadása</DialogTitle>
                                <p className="text-xs text-slate-400">Rögzíts új partnert a CRM rendszerben</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    Cég / Szervezet
                                </label>
                                <Input
                                    placeholder="Pl. Cégnév Kft."
                                    value={newLead.companyName}
                                    onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/40 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" />
                                    Kapcsolattartó neve
                                </label>
                                <Input
                                    placeholder="Pl. Kovács Péter"
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/40 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                E-mail cím *
                            </label>
                            <Input
                                type="email"
                                required
                                placeholder="Pl. info@cegnev.hu"
                                value={newLead.email}
                                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/40 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Státusz</label>
                            <Select
                                value={newLead.status}
                                onValueChange={(val) => setNewLead({ ...newLead, status: val })}
                            >
                                <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c1222] border-white/[0.08] rounded-xl">
                                    <SelectItem value="LEAD">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                            Lead (Leendő)
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="AJÁNLAT">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                                            Ajánlat (Érdeklődő)
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="AKTÍV">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            Aktív (Meglévő Ügyfél)
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="INAKTÍV">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                                            Inaktív
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jegyzetek / Részletes leírás</label>
                            <Textarea
                                placeholder="Részletes leírás az ügyfél igényeiről, a projektről és a megbeszéltekről..."
                                value={newLead.notes}
                                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                                rows={4}
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-500/40 rounded-xl resize-none"
                            />
                        </div>
                        <DialogFooter className="pt-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05] rounded-xl"
                            >
                                Mégse
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 rounded-xl px-6"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Létrehozás
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ─── Edit Dialog ──────────────────────────────────── */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[540px] bg-[#0a0f1e] border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-0">
                    {/* Dialog Header */}
                    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-violet-500/10 via-blue-500/5 to-transparent border-b border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Pencil className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">{t("edit_lead")}</DialogTitle>
                                <p className="text-xs text-slate-400">{editingLead?.companyName || editingLead?.email}</p>
                            </div>
                        </div>
                    </div>

                    {editingLead && (
                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5" />
                                        {t("company")}
                                    </label>
                                    <Input
                                        value={editingLead.companyName || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, companyName: e.target.value })}
                                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-violet-500/40 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        {t("contact_person")}
                                    </label>
                                    <Input
                                        value={editingLead.name || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-violet-500/40 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("status")}</label>
                                <Select
                                    value={editingLead.status}
                                    onValueChange={(val) => setEditingLead({ ...editingLead, status: val })}
                                >
                                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0c1222] border-white/[0.08] rounded-xl">
                                        <SelectItem value="LEAD">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                                Lead (Leendő)
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="AJÁNLAT">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-amber-400" />
                                                Ajánlat (Érdeklődő)
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="AKTÍV">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                                Aktív (Meglévő Ügyfél)
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="INAKTÍV">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                                Inaktív
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <CalendarCheck className="h-3.5 w-3.5" />
                                    {t("last_contact")}
                                </label>
                                <Input
                                    type="date"
                                    value={editingLead.lastContactedAt ? new Date(editingLead.lastContactedAt).toISOString().split("T")[0] : ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, lastContactedAt: e.target.value ? new Date(e.target.value) : null })}
                                    className="bg-white/[0.03] border-white/[0.08] text-white focus:border-violet-500/40 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jegyzetek / Részletes leírás</label>
                                <Textarea
                                    value={editingLead.notes || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                                    rows={4}
                                    className="bg-white/[0.03] border-white/[0.08] text-white focus:border-violet-500/40 rounded-xl resize-none"
                                />
                            </div>
                            <DialogFooter className="pt-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05] rounded-xl"
                                >
                                    Mégse
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/20 rounded-xl px-6"
                                >
                                    {t("save")}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* ─── Outreach Dialog (Szabó Ábel B2B Outreach Engine) ─── */}
            <Dialog open={isOutreachOpen} onOpenChange={setIsOutreachOpen}>
                <DialogContent className="sm:max-w-[720px] max-h-[92vh] overflow-y-auto bg-[#0a0f1e] border-white/[0.08] rounded-2xl shadow-2xl p-0">
                    {/* Dialog Header */}
                    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
                                <Send className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DialogTitle className="text-lg font-bold text-white">
                                        B2B Lead Megkeresés & Outreach
                                    </DialogTitle>
                                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px] font-semibold">
                                        Szabó Ábel
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-400 truncate">
                                    Címzett: <span className="text-slate-200 font-semibold">{outreachLead?.companyName || outreachLead?.name || outreachLead?.email}</span> ({outreachLead?.email}) • Forrás: {outreachLead?.source || "Nincs adat"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* 1-Click Multi-Channel Quick Outreach Cards */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                                Gyors Megkeresés Közösségi Csatornákon
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleCopyLinkedIn}
                                    className="flex items-start gap-3 p-3.5 rounded-xl border border-[#0077b5]/30 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-left transition-all duration-200 group"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-[#0077b5] flex items-center justify-center shrink-0 shadow-md">
                                        <ExternalLink className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-white group-hover:text-cyan-200">
                                                LinkedIn DM Másolás & Megnyitás
                                            </p>
                                            {copiedChannel === "linkedin" && (
                                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                                                    <Check className="h-3 w-3" /> Másolva!
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 line-clamp-1">
                                            Profil keresése és személyre szabott üzenet vágólapra
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopyFacebook}
                                    className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-600/30 bg-blue-600/10 hover:bg-blue-600/20 text-left transition-all duration-200 group"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                                        <MessageSquare className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-white group-hover:text-blue-200">
                                                Facebook Csoport / DM Válasz
                                            </p>
                                            {copiedChannel === "facebook" && (
                                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                                                    <Check className="h-3 w-3" /> Másolva!
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 line-clamp-1">
                                            ÁFA-mentes & referenciás válasz másolása posztokhoz
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Direct Email Outreach Section */}
                        <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-cyan-400" />
                                    Közvetlen Hideg E-mail (szabo.abel@backlineit.hu)
                                </label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isGeneratingPitch}
                                    onClick={handleGenerateAiPitch}
                                    className="h-7 text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 rounded-lg gap-1.5"
                                >
                                    {isGeneratingPitch ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            <span>AI generálás folyamatban...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                            <span>✨ AI Nyitószöveg (Azure GPT-4o)</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] text-slate-500 font-medium">E-mail Tárgy</label>
                                <Input
                                    value={outreachSubject}
                                    onChange={(e) => setOutreachSubject(e.target.value)}
                                    placeholder="Tárgy..."
                                    className="bg-white/[0.03] border-white/[0.08] text-white focus:border-cyan-500/40 rounded-xl text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] text-slate-500 font-medium">Személyre Szabott Nyitó Bekezdés</label>
                                <Textarea
                                    rows={4}
                                    value={outreachIntro}
                                    onChange={(e) => setOutreachIntro(e.target.value)}
                                    placeholder="Írd ide a nyitó bekezdést, vagy használd az AI generálót..."
                                    className="bg-white/[0.03] border-white/[0.08] text-white focus:border-cyan-500/40 rounded-xl text-sm resize-none"
                                />
                            </div>

                            {/* Live Email Value Proposition Preview */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                    Az e-mailbe automatikusan beágyazott kiemelt értékajánlataink:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>Áfamentes számlázás (0% ÁFA, 27% megtakarítás)</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>Microsoft által támogatott startup garancia</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>Referenciák & demók: backlineit.hu/referenciak</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>30 perces ingyenes konzultáció & 90 nap garancia</span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/[0.04] flex items-center justify-between flex-wrap gap-1">
                                    <span>Hivatalos céges aláírás: <strong className="text-slate-200">Szabó Ábel</strong> (Backline IT)</span>
                                    <span className="font-mono text-cyan-400">szabo.abel@backlineit.hu</span>
                                </div>
                            </div>
                        </div>

                        {/* Dialog Action Buttons */}
                        <DialogFooter className="pt-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOutreachOpen(false)}
                                className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05] rounded-xl"
                            >
                                Mégse
                            </Button>
                            <Button
                                type="button"
                                disabled={isSendingEmail}
                                onClick={handleSendOutreachEmail}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 rounded-xl px-6 gap-2"
                            >
                                {isSendingEmail ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Kiküldés folyamatban...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>E-mail Küldése (szabo.abel@backlineit.hu)</span>
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ─── Lead Hunter Dialog (Google Maps, Facebook & LinkedIn) ─── */}
            <Dialog open={isHunterOpen} onOpenChange={setIsHunterOpen}>
                <DialogContent className="sm:max-w-[850px] max-h-[92vh] overflow-y-auto bg-[#0a0f1e] border-white/[0.08] rounded-2xl shadow-2xl p-0">
                    {/* Header */}
                    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-transparent border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                                <Compass className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DialogTitle className="text-lg font-bold text-white">
                                        🎯 B2B Lead Vadász Motor
                                    </DialogTitle>
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-semibold">
                                        Google Maps • FB • LinkedIn
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Kutasd fel a legértékesebb új potenciális ügyfeleket, és importáld őket egyetlen kattintással a CRM-be.
                                </p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                            <button
                                type="button"
                                onClick={() => setHunterTab("google")}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    hunterTab === "google"
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                                }`}
                            >
                                <Globe className="h-3.5 w-3.5" />
                                <span>Google & Web Cégkereső</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setHunterTab("facebook")}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    hunterTab === "facebook"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                        : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                                }`}
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>Facebook Csoport Vadász</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setHunterTab("linkedin")}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    hunterTab === "linkedin"
                                        ? "bg-[#0077b5] text-white shadow-lg shadow-[#0077b5]/25"
                                        : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                                }`}
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>LinkedIn Döntéshozó Kereső</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* ── TAB 1: GOOGLE & WEB CÉGKERESŐ ── */}
                        {hunterTab === "google" && (
                            <div className="space-y-5">
                                {/* Search filters */}
                                <div className="space-y-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Város / Régió kiválasztása</label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {["Budapest", "Debrecen", "Szeged", "Győr", "Pécs", "Székesfehérvár", "Miskolc", "Kecskemét"].map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setHunterCity(c)}
                                                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                                        hunterCity === c
                                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06]"
                                                    }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                        <Input
                                            value={hunterCity}
                                            onChange={(e) => setHunterCity(e.target.value)}
                                            placeholder="Vagy írj be egy másik várost..."
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-sm h-9"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Iparág / Szakterület</label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {["Fogászat", "Ügyvédi Iroda", "Könyvelőiroda", "Autószerviz", "Webáruház", "Magánrendelő", "Építőipar"].map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setHunterCategory(cat)}
                                                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                                        hunterCategory === cat
                                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06]"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                        <Input
                                            value={hunterCategory}
                                            onChange={(e) => setHunterCategory(e.target.value)}
                                            placeholder="Vagy írj be egy másik kategóriát..."
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-sm h-9"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        disabled={isSearchingLeads}
                                        onClick={handleSearchLiveLeads}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl h-10 shadow-lg shadow-emerald-500/20 gap-2"
                                    >
                                        {isSearchingLeads ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Élő cégadatok és elérhetőségek gyűjtése...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4" />
                                                <span>Leadek Vadászata (Google & Web)</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Results display */}
                                {huntedLeads.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                                                Talált Leadek ({huntedLeads.length} cég)
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {huntedLeads.map((item, idx) => {
                                                const isImported = importedLeadEmails.has(item.email.toLowerCase());
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-3"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                                    {item.companyName}
                                                                    {item.name && (
                                                                        <span className="text-xs font-normal text-slate-400">
                                                                            ({item.name})
                                                                        </span>
                                                                    )}
                                                                </h4>
                                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                                                                    <span className="font-mono text-cyan-300">{item.email}</span>
                                                                    {item.phone && (
                                                                        <span className="text-slate-300 flex items-center gap-1">
                                                                            <Phone className="h-3 w-3 text-slate-500" />
                                                                            {item.phone}
                                                                        </span>
                                                                    )}
                                                                    {item.website && (
                                                                        <a
                                                                            href={`https://${item.website.replace(/^https?:\/\//, '')}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-blue-400 hover:underline flex items-center gap-1"
                                                                        >
                                                                            <Globe className="h-3 w-3" />
                                                                            {item.website}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={isImported}
                                                                    onClick={() => handleImportHuntedLead(item, false)}
                                                                    className={`h-8 text-xs rounded-lg ${
                                                                        isImported
                                                                            ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                                                                            : "border-white/10 text-slate-300 hover:bg-white/5"
                                                                    }`}
                                                                >
                                                                    {isImported ? "✓ Importálva" : "📥 CRM-be"}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() => handleImportHuntedLead(item, true)}
                                                                    className="h-8 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-sm gap-1.5"
                                                                >
                                                                    <Send className="h-3 w-3" />
                                                                    <span>Megkeresés</span>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {item.painPoint && (
                                                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                                                                <span className="font-semibold shrink-0">💡 Lehetőség:</span>
                                                                <span>{item.painPoint}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TAB 2: FACEBOOK CSOPORT VADÁSZ ── */}
                        {hunterTab === "facebook" && (
                            <div className="space-y-5">
                                {/* Hot FB Groups */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                        <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                                        Kiemelt Magyar Vállalkozói Csoportok (Kattints a megnyitáshoz)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <a
                                            href="https://www.facebook.com/groups/search/groups/?q=v%C3%A1llalkoz%C3%B3k"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-slate-200 group-hover:text-blue-300">👥 Magyar Vállalkozók & Cégvezetők</span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/groups/search/groups/?q=weboldal%20k%C3%A9sz%C3%ADt%C3%A9s"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-slate-200 group-hover:text-blue-300">🌐 Weboldal készítés & IT kereső</span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/groups/search/groups/?q=kkv%20sz%C3%B6vets%C3%A9g"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-slate-200 group-hover:text-blue-300">📈 KKV Szövetség & Vállalkozói Klub</span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/groups/search/groups/?q=web%C3%A1ruh%C3%A1z%20tulajdonosok"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-slate-200 group-hover:text-blue-300">🛒 Webáruház Tulajdonosok</span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                                        </a>
                                    </div>
                                </div>

                                {/* AI Post Analyzer Form */}
                                <div className="space-y-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                                        AI Poszt Elemző & Megkeresés Készítő
                                    </h4>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-slate-400">Posztoló neve vagy Facebook profil neve</label>
                                        <Input
                                            value={fbPosterName}
                                            onChange={(e) => setFbPosterName(e.target.value)}
                                            placeholder="Pl. Kovács Gergő"
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-slate-400">Facebook poszt kimásolt szövege</label>
                                        <Textarea
                                            rows={3}
                                            value={fbPostText}
                                            onChange={(e) => setFbPostText(e.target.value)}
                                            placeholder="Illeszd be ide a posztot, amit a csoportban láttál..."
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-sm resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        disabled={isAnalyzingFb}
                                        onClick={handleAnalyzeFbPost}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-10 shadow-lg shadow-blue-600/20 gap-2"
                                    >
                                        {isAnalyzingFb ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Poszt elemzése és CRM mentés...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4" />
                                                <span>✨ Poszt Elemzése & Lead Rögzítése</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {fbAnalysisResult && (
                                    <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-blue-300">
                                                Azonosított igény: {fbAnalysisResult.detectedNeed}
                                            </span>
                                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                                                ✓ CRM-be rögzítve
                                            </Badge>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 whitespace-pre-line font-sans">
                                            {fbAnalysisResult.suggestedComment}
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(fbAnalysisResult.suggestedComment);
                                                toast.success("Ajánlott válasz vágólapra másolva!");
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg h-9 gap-1.5"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                            <span>Válasz Másolása a Facebookra</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TAB 3: LINKEDIN DÖNTÉSHOZÓ VADÁSZ ── */}
                        {hunterTab === "linkedin" && (
                            <div className="space-y-5">
                                <div className="space-y-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Target className="h-3.5 w-3.5 text-[#0077b5]" />
                                        LinkedIn X-Ray Döntéshozó Kereső (Ingyenes Sales Navigator)
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                        Közvetlenül a Google adatbázisán keresztül szűrheted le a magyar cégvezetőket fizetős előfizetés nélkül.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] text-slate-400">Pozíció / Szerepkör</label>
                                            <Input
                                                value={linkedInRole}
                                                onChange={(e) => setLinkedInRole(e.target.value)}
                                                placeholder="Pl. Ügyvezető"
                                                className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] text-slate-400">Város / Helyszín</label>
                                            <Input
                                                value={linkedInCity}
                                                onChange={(e) => setLinkedInCity(e.target.value)}
                                                placeholder="Pl. Budapest"
                                                className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] text-slate-400">Iparág / Cégtípus</label>
                                            <Input
                                                value={linkedInIndustry}
                                                onChange={(e) => setLinkedInIndustry(e.target.value)}
                                                placeholder="Pl. Webáruház"
                                                className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleOpenLinkedInSearch}
                                        className="w-full bg-[#0077b5] hover:bg-[#006097] text-white font-bold rounded-xl h-10 shadow-lg shadow-[#0077b5]/25 gap-2"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Döntéshozók Megnyitása a LinkedInen (Google X-Ray)</span>
                                    </Button>
                                </div>

                                {/* Quick save LinkedIn lead */}
                                <div className="space-y-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Plus className="h-3.5 w-3.5 text-cyan-400" />
                                        Megtalált LinkedIn Profil Gyorsrögzítése
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            value={liName}
                                            onChange={(e) => setLiName(e.target.value)}
                                            placeholder="Kapcsolattartó neve (pl. Kiss Péter)"
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                        />
                                        <Input
                                            value={liCompany}
                                            onChange={(e) => setLiCompany(e.target.value)}
                                            placeholder="Cégnév (pl. Webshop Kft.)"
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                        />
                                        <Input
                                            value={liUrl}
                                            onChange={(e) => setLiUrl(e.target.value)}
                                            placeholder="LinkedIn profil URL linkje"
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                        />
                                        <Input
                                            value={liEmail}
                                            onChange={(e) => setLiEmail(e.target.value)}
                                            placeholder="E-mail (ha ismert, vagy hagyd üresen)"
                                            className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl text-xs h-9"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        disabled={isSavingLi}
                                        onClick={handleSaveLinkedInLead}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl h-10 shadow-lg shadow-cyan-500/20 gap-2"
                                    >
                                        {isSavingLi ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                        <span>Mentés a CRM-be & Azonnali Megkeresés</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-white/[0.06]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsHunterOpen(false)}
                                className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05] rounded-xl"
                            >
                                Bezárás
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
