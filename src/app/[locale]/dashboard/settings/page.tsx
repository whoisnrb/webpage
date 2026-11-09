import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server"
import { ShieldCheck } from "lucide-react"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const tDash   = await getTranslations({ locale, namespace: 'Dashboard' })
    const tCommon = await getTranslations({ locale, namespace: 'Common' })
    const session = await auth()

    if (!session?.user) redirect("/login")

    // Közvetlenül az adatbázisból olvassuk fel a valós, friss adatokat
    const dbUser = session.user.email ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, email: true, image: true, role: true }
    }) : null

    const userName  = dbUser?.name || session.user.name || ''
    const userEmail = dbUser?.email || session.user.email || ''
    const initials  = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

    return (
        <div className="space-y-8 max-w-2xl animate-fadeIn">

            {/* Page header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{tDash('settings')}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{tDash('manage_account')}</p>
            </div>

            {/* Avatar preview */}
            <div className="flex items-center gap-5 rounded-xl border border-white/5 bg-card/40 backdrop-blur p-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-purple-600/20 text-xl font-bold text-primary ring-2 ring-primary/20">
                    {initials}
                </div>
                <div>
                    <p className="font-semibold">{userName || tDash('anonymous_user')}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Hitelesítve
                </div>
            </div>

            {/* Profile form */}
            <SettingsForm
                initialName={userName}
                userEmail={userEmail}
                labels={{
                    profileInfo: tDash('profile_info'),
                    updateProfile: tDash('update_profile'),
                    emailLabel: tDash('email_label'),
                    emailNotEditable: tDash('email_not_editable'),
                    nameLabel: tDash('name_label'),
                    namePlaceholder: tDash('name_placeholder'),
                    save: tCommon('save'),
                    saved: "Elmentve!",
                    saving: "Mentés folyamatban...",
                }}
            />
        </div>
    )
}
