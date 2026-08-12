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
import { updateLead, deleteLead, createLead } from "@/app/actions/crm";
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

                {/* Add Button */}
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 rounded-xl px-5 transition-all duration-300 shrink-0"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Új Ügyfél
                </Button>
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-[#0c1222] border-white/[0.08] rounded-xl shadow-2xl">
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
        </div>
    );
}
