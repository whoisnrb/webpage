import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { DeliverabilityClient } from "./deliverability-client"

export const metadata = {
    title: "Email Kézbesíthetőség & Spam Score Tesztelő | BacklineIT Admin",
    description: "Automata email kézbesíthetőség, SPF, DMARC, DKIM és szöveges spam score elemzés.",
}

export default async function AdminDeliverabilityPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <DeliverabilityClient />
        </div>
    )
}
