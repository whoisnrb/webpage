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
import { updateLead, deleteLead } from "@/app/actions/crm";
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
            // Refresh local state or use server actions revalidation
        } else {
            toast.error(t("save_error"));
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

    if (leads.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title={t("no_leads_title")}
                description={t("no_leads_desc")}
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("company")}</TableHead>
                            <TableHead>{t("contact_person")}</TableHead>
                            <TableHead>{t("email")}</TableHead>
                            <TableHead>{t("status")}</TableHead>
                            <TableHead>{t("last_contact")}</TableHead>
                            <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">{lead.companyName || "-"}</TableCell>
                                <TableCell>{lead.name || "-"}</TableCell>
                                <TableCell>{lead.email}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(lead.status) as any}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {lead.lastContactedAt
                                        ? new Date(lead.lastContactedAt).toLocaleDateString('hu-HU')
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingLead(lead);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

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
                                        <SelectItem value="LEAD">Lead</SelectItem>
                                        <SelectItem value="AJÁNLAT">Ajánlat</SelectItem>
                                        <SelectItem value="AKTÍV">Aktív</SelectItem>
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
                                <label className="text-sm font-medium">{t("notes")}</label>
                                <Textarea
                                    value={editingLead.notes || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">{t("save")}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
