import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { SpeedClient } from "./speed-client"

export const metadata = {
    title: "Weboldal Sebesség & Konverzió Robot | BacklineIT Admin",
    description: "Automata weboldal sebesség, TTFB, Core Web Vitals és becsült konverzióvesztés audit.",
}

export default async function AdminSpeedAuditPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <SpeedClient />
        </div>
    )
}
