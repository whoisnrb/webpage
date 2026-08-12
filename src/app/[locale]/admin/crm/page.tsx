import { getLeads } from "@/app/actions/crm";
import { LeadManagement } from "@/components/admin/crm/lead-management";
import { getTranslations } from "next-intl/server";

export default async function CRMPage() {
    const leads = await getLeads();
    const t = await getTranslations("CRM");

    return (
        <div className="space-y-6">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 border border-white/[0.06] p-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLS45LTItMi0yaC00Yy0xLjEgMC0yIC45LTIgMnY0YzAgMS4xLjkgMiAyIDJoNGMxLjEgMCAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-cyan-400/80">Ügyfélkezelő Rendszer</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                        {t("title")}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400 max-w-lg">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            {/* CRM Content */}
            <LeadManagement initialLeads={leads as any} />
        </div>
    );
}
