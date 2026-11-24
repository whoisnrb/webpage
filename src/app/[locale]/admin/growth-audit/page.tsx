import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { GrowthAuditClient } from "./growth-client"

export const metadata = {
    title: "1-Kattintásos Weboldal Növekedési Audit | BacklineIT Admin",
    description: "Stratégiai weboldal elemzés, Core Web Vitals, IT biztonság, SEO és 1-kattintásos PDF riport generálás.",
}

export default async function AdminGrowthAuditPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <GrowthAuditClient />
        </div>
    )
}
