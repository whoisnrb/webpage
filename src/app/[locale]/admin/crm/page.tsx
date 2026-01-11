import { getLeads } from "@/app/actions/crm";
import { LeadManagement } from "@/components/admin/crm/lead-management";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function CRMPage() {
    const leads = await getLeads();
    const t = await getTranslations("CRM");

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                    <CardTitle>{t("leads_title")}</CardTitle>
                    <CardDescription>
                        Kezeld az érdeklődőidet és kövesd nyomon az értékesítési folyamatot.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LeadManagement initialLeads={leads as any} />
                </CardContent>
            </Card>
        </div>
    );
}
