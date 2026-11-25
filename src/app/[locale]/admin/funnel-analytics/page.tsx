import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { FunnelClient } from "./funnel-client"

export const metadata = {
    title: "Konverziós Tölcsér & Űrlap Lemorzsolódás | BacklineIT Admin",
    description: "Lépésről lépésre látogatói tölcsér analitika, .hu és .com összehasonlítás és űrlap-félbehagyás diagnosztika.",
}

export default async function AdminFunnelAnalyticsPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <FunnelClient />
        </div>
    )
}
