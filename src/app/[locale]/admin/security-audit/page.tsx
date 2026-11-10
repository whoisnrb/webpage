import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { AuditClient } from "./audit-client"

export const metadata = {
    title: "IT Biztonsági Audit Robot | BacklineIT Admin",
    description: "Automata IT sebezhetőség- és biztonsági vizsgálat Azure OpenAI GPT-4o elemzéssel.",
}

export default async function AdminSecurityAuditPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <AuditClient />
        </div>
    )
}
