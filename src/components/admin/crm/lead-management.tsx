"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
    DialogTrigger,
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
import { updateLead, deleteLead, createLead } from "@/app/actions/crm";
import { toast } from "sonner";
import { Edit2, Trash2, Calendar, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

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

export function LeadManagement({ initialLeads }: { initialLeads: Lead[] }) {
    const t = useTranslations("CRM");
    const [leads, setLeads] = useState(initialLeads);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newLead, setNewLead] = useState({
        name: "",
        companyName: "",
        email: "",
        status: "LEAD",
        notes: "",
    });

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
            setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
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
            setLeads(prev => [result.lead as Lead, ...prev]);
            setNewLead({
                name: "",
                companyName: "",
                email: "",
                status: "LEAD",
                notes: "",
            });
        } else {
            toast.error(result.error || "Hiba történt a létrehozás során");
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "LEAD": return "secondary";
            case "AJÁNLAT": return "warning";
            case "AKTÍV": return "success";
            case "INAKTÍV": return "destructive";
            default: return "outline";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-muted/20 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">Ügyfelek & Érdeklődők</h3>
                    <p className="text-xs text-muted-foreground">Kézzel is rögzíthetsz új partnereket a CRM rendszerben.</p>
                </div>
                <Button 
                    onClick={() => setIsCreateDialogOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all duration-200"
                >
                    + Új Ügyfél Rögzítése
                </Button>
            </div>

            {leads.length === 0 ? (
                <div className="rounded-lg border bg-card p-8 shadow-sm">
                    <EmptyState
                        icon={Users}
                        title={t("no_leads_title")}
                        description={t("no_leads_desc")}
                    />
                </div>
            ) : (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="font-semibold">{t("company")}</TableHead>
                                <TableHead className="font-semibold">{t("contact_person")}</TableHead>
                                <TableHead className="font-semibold">{t("email")}</TableHead>
                                <TableHead className="font-semibold">{t("status")}</TableHead>
                                <TableHead className="font-semibold">{t("last_contact")}</TableHead>
                                <TableHead className="font-semibold text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="font-semibold text-sm">{lead.companyName || "-"}</TableCell>
                                    <TableCell className="text-sm">{lead.name || "-"}</TableCell>
                                    <TableCell className="text-sm font-mono text-muted-foreground">{lead.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(lead.status) as any} className="font-medium text-xs">
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {lead.lastContactedAt
                                            ? new Date(lead.lastContactedAt).toLocaleDateString('hu-HU')
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                onClick={() => {
                                                    setEditingLead(lead);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                onClick={async () => {
                                                    if (confirm("Biztosan törölni szeretné ezt az ügyfelet?")) {
                                                        const res = await deleteLead(lead.id);
                                                        if (res.success) {
                                                            toast.success("Ügyfél törölve!");
                                                            setLeads(prev => prev.filter(l => l.id !== lead.id));
                                                        } else {
                                                            toast.error(res.error || "Hiba a törlés során");
                                                        }
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Új Ügyfél Hozzáadása</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cég / Szervezet *</label>
                                <Input
                                    placeholder="Pl. Cégnév Kft."
                                    value={newLead.companyName}
                                    onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kapcsolattartó neve</label>
                                <Input
                                    placeholder="Pl. Kovács Péter"
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail cím *</label>
                            <Input
                                type="email"
                                required
                                placeholder="Pl. info@cegnev.hu"
                                value={newLead.email}
                                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Státusz</label>
                            <Select
                                value={newLead.status}
                                onValueChange={(val) => setNewLead({ ...newLead, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LEAD">Lead (Leendő)</SelectItem>
                                    <SelectItem value="AJÁNLAT">Ajánlat (Érdeklődő)</SelectItem>
                                    <SelectItem value="AKTÍV">Aktív (Meglévő Ügyfél)</SelectItem>
                                    <SelectItem value="INAKTÍV">Inaktív</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jegyzetek / Részletes leírás</label>
                            <Textarea
                                placeholder="Részletes leírás az ügyfél igényeiről, a projektről és a megbeszéltekről..."
                                value={newLead.notes}
                                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                                rows={5}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Mégse</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Létrehozás</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t("edit_lead")}</DialogTitle>
                    </DialogHeader>
                    {editingLead && (
                        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("company")}</label>
                                    <Input
                                        value={editingLead.companyName || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("contact_person")}</label>
                                    <Input
                                        value={editingLead.name || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("status")}</label>
                                <Select
                                    value={editingLead.status}
                                    onValueChange={(val) => setEditingLead({ ...editingLead, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LEAD">Lead (Leendő)</SelectItem>
                                        <SelectItem value="AJÁNLAT">Ajánlat (Érdeklődő)</SelectItem>
                                        <SelectItem value="AKTÍV">Aktív (Meglévő Ügyfél)</SelectItem>
                                        <SelectItem value="INAKTÍV">Inaktív</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("last_contact")}</label>
                                <Input
                                    type="date"
                                    value={editingLead.lastContactedAt ? new Date(editingLead.lastContactedAt).toISOString().split('T')[0] : ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, lastContactedAt: e.target.value ? new Date(e.target.value) : null })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Jegyzetek / Részletes leírás</label>
                                <Textarea
                                    value={editingLead.notes || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                                    rows={5}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Mégse</Button>
                                <Button type="submit">{t("save")}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
