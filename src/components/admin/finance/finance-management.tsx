"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addTransaction, addFinancialSubscription } from "@/app/actions/finance";
import { toast } from "sonner";
import { Plus, ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction {
    id: string;
    type: string;
    category: string;
    amount: number;
    currency: string;
    taxAmount: number;
    date: Date;
    description: string | null;
}

interface FinancialSubscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    billingCycle: string;
    nextBillingDate: Date | null;
    status: string;
}

interface Props {
    transactions: Transaction[];
    subscriptions: FinancialSubscription[];
    stats: {
        income: number;
        expenses: number;
        taxes: number;
        net: number;
    };
}

export function FinanceManagement({ transactions, subscriptions, stats }: Props) {
    const t = useTranslations("Finance");
    const [isTransDialogOpen, setIsTransDialogOpen] = useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);

    const [newTrans, setNewTrans] = useState({
        type: "INCOME",
        category: "SALE",
        amount: 0,
        taxAmount: 0,
        description: "",
    });

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await addTransaction({
            ...newTrans,
            amount: Number(newTrans.amount),
            taxAmount: Number(newTrans.taxAmount),
        });

        if (result.success) {
            toast.success("Tranzakció rögzítve");
            setIsTransDialogOpen(false);
        } else {
            toast.error("Hiba történt");
        }
    };

    const chartData = [
        { name: t("income"), value: stats.income },
        { name: t("expenses"), value: stats.expenses },
        { name: t("tax"), value: stats.taxes },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("revenue")}</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.income.toLocaleString()} HUF</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("expense")}</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expenses.toLocaleString()} HUF</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("tax")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.taxes.toLocaleString()} HUF</div>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("net_profit")}</CardTitle>
                        <PiggyBank className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.net.toLocaleString()} HUF</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Pénzügyi Áttekintés</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Subscriptions */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{t("subscriptions")}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsSubDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {subscriptions.length === 0 && <p className="text-sm text-muted-foreground">Nincs rögzített előfizetés.</p>}
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{sub.name}</p>
                                        <p className="text-xs text-muted-foreground">{sub.billingCycle}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{sub.amount.toLocaleString()} {sub.currency}</p>
                                        {sub.nextBillingDate && (
                                            <p className="text-[10px] text-muted-foreground">
                                                Next: {new Date(sub.nextBillingDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t("transactions")}</CardTitle>
                    </div>
                    <Button onClick={() => setIsTransDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("add_transaction")}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("date")}</TableHead>
                                <TableHead>{t("type")}</TableHead>
                                <TableHead>{t("category")}</TableHead>
                                <TableHead>{t("amount")}</TableHead>
                                <TableHead>{t("description")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tr) => (
                                <TableRow key={tr.id}>
                                    <TableCell>{new Date(tr.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={tr.type === "INCOME" ? "success" : "destructive"} className="uppercase">
                                            {tr.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{tr.category}</TableCell>
                                    <TableCell className="font-bold">
                                        {tr.type === "EXPENSE" ? "-" : "+"} {tr.amount.toLocaleString()} {tr.currency}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">{tr.description || "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Transaction Dialog */}
            <Dialog open={isTransDialogOpen} onOpenChange={setIsTransDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("add_transaction")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTransaction} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("type")}</label>
                                <Select onValueChange={(v) => setNewTrans({ ...newTrans, type: v })} defaultValue="INCOME">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INCOME">Bevétel</SelectItem>
                                        <SelectItem value="EXPENSE">Kiadás</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("category")}</label>
                                <Select onValueChange={(v) => setNewTrans({ ...newTrans, category: v })} defaultValue="SALE">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SALE">Értékesítés</SelectItem>
                                        <SelectItem value="AD">Hirdetés</SelectItem>
                                        <SelectItem value="SUBSCRIPTION">Szoftver / Előfizetés</SelectItem>
                                        <SelectItem value="SALARY">Bér</SelectItem>
                                        <SelectItem value="TAX">Adó</SelectItem>
                                        <SelectItem value="OTHER">Egyéb</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("amount")} (HUF)</label>
                                <Input type="number" onChange={(e) => setNewTrans({ ...newTrans, amount: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("tax")} (HUF)</label>
                                <Input type="number" onChange={(e) => setNewTrans({ ...newTrans, taxAmount: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("description")}</label>
                            <Input onChange={(e) => setNewTrans({ ...newTrans, description: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Mentés</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
