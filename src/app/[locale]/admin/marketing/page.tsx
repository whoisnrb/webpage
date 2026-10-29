import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { MarketingClient } from "./marketing-client"

export const metadata = {
    title: "AI Marketing Autopilot | BacklineIT Admin",
    description: "Belső AI Marketing Autopilot: SEO blogcikkek, LinkedIn posztok és DALL-E képi koncepciók generálása az Azure OpenAI GPT-4o motorral.",
}

export default async function AdminMarketingPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="space-y-6">
            <MarketingClient userEmail={session.user.email || ""} />
        </div>
    )
}
