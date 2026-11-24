import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { SeoTrackerClient } from "./seo-tracker-client"

export const metadata = {
    title: "SEO Pozíció- & Kulcsszó Tracker (.hu és .com) | BacklineIT Admin",
    description: "Keresőoptimalizálási kulcsszavak, Google pozíciók, keresési volumen és domain szintű organikus rangsorolás.",
}

export default async function AdminSeoTrackerPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(session.user.role || "")) {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <SeoTrackerClient />
        </div>
    )
}
