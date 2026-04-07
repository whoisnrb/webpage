import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { User, Mail, ShieldCheck, Save } from "lucide-react"

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const tDash   = await getTranslations({ locale, namespace: 'Dashboard' })
    const tCommon = await getTranslations({ locale, namespace: 'Common' })
    const session = await auth()

    if (!session?.user) redirect("/login")

    async function updateProfile(formData: FormData) {
        "use server"
        const name = formData.get("name") as string
        if (session?.user?.email) {
            await prisma.user.update({
                where: { email: session.user.email },
                data: { name },
            })
            revalidatePath("/dashboard/settings")
        }
    }

    const userName  = session.user.name  || ''
    const userEmail = session.user.email || ''
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
                    <p className="font-semibold">{userName || 'Névtelen felhasználó'}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Hitelesítve
                </div>
            </div>

            {/* Profile form */}
            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{tDash('profile_info')}</p>
                        <p className="text-xs text-muted-foreground">{tDash('update_profile')}</p>
                    </div>
                </div>

                <form action={updateProfile} className="p-5 space-y-5">
                    {/* Email — read only */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <Mail className="h-3 w-3" />
                            {tDash('email_label')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                value={userEmail}
                                disabled
                                className="bg-white/5 border-white/8 text-muted-foreground pr-20"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground/60 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                                Nem módosítható
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60">{tDash('email_not_editable')}</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            {tDash('name_label')}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={userName}
                            placeholder={tDash('name_placeholder')}
                            className="bg-white/5 border-white/8 focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <div className="pt-1">
                        <Button type="submit" className="inline-flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {tCommon('save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
