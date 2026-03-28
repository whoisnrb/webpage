import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

import { getTranslations } from "next-intl/server"

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const tDash = await getTranslations({ locale, namespace: 'Dashboard' })
    const tCommon = await getTranslations({ locale, namespace: 'Common' })
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

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

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{tDash('settings')}</h2>
                <p className="text-muted-foreground">{tDash('manage_account')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{tDash('profile_info')}</CardTitle>
                    <CardDescription>
                        {tDash('update_profile')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{tDash('email_label')}</Label>
                            <Input id="email" value={session.user.email || ''} disabled />
                            <p className="text-[0.8rem] text-muted-foreground">
                                {tDash('email_not_editable')}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">{tDash('name_label')}</Label>
                            <Input id="name" name="name" defaultValue={session.user.name || ''} placeholder={tDash('name_placeholder')} />
                        </div>
                        <Button type="submit">{tCommon('save')}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
