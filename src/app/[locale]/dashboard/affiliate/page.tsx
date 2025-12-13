import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyIcon, DollarSign, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CopyButton } from "@/components/ui/copy-button"; // Assuming we have or will create this, or use inline client component

export default async function AffiliatePage() {
    const session = await auth();
    const t = await getTranslations("Affiliate");

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            referrals: true,
            referralRewards: true,
        }
    });

    if (!user) return null;

    const referralLink = `https://backlineit.hu?ref=${user.referralCode || "ERROR"}`;
    const totalEarnings = user.referralRewards
        .filter(r => r.status === "PAID")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingEarnings = user.referralRewards
        .filter(r => r.status === "PENDING")
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t("title")}</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("total_earnings")}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEarnings} Ft</div>
                        <p className="text-xs text-muted-foreground">
                            + {pendingEarnings} Ft {t("pending")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("registered_referrals")}
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.referrals.length}</div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("your_referral_link")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 items-center">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold w-full overflow-hidden text-ellipsis">
                            {referralLink}
                        </code>
                        <CopyButton value={referralLink} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("recent_referrals")}</CardTitle>
                    <CardDescription>{t("referrals_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("table_date")}</TableHead>
                                <TableHead>{t("table_user")}</TableHead>
                                <TableHead>{t("table_status")}</TableHead>
                                <TableHead className="text-right">{t("table_reward")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {user.referrals.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        {t("no_referrals_yet")}
                                    </TableCell>
                                </TableRow>
                            )}
                            {user.referrals.map((referral) => (
                                <TableRow key={referral.id}>
                                    <TableCell>{new Date(referral.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{referral.name || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            {t("status_registered")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        -
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
