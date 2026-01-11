import { getTransactions, getFinancialSubscriptions, getFinanceStats } from "@/app/actions/finance";
import { FinanceManagement } from "@/components/admin/finance/finance-management";
import { getTranslations } from "next-intl/server";

export default async function FinancePage() {
    const transactions = await getTransactions();
    const subscriptions = await getFinancialSubscriptions();
    const stats = await getFinanceStats();
    const t = await getTranslations("Finance");

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                </div>
            </div>

            <FinanceManagement
                transactions={transactions as any}
                subscriptions={subscriptions as any}
                stats={stats}
            />
        </div>
    );
}
