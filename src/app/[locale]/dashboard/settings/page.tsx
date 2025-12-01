import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export default async function SettingsPage() {
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
                <h2 className="text-3xl font-bold tracking-tight">Beállítások</h2>
                <p className="text-muted-foreground">Fiók adatainak kezelése.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profil Információk</CardTitle>
                    <CardDescription>
                        Frissítsd a profilod adatait.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail cím</Label>
                            <Input id="email" value={session.user.email || ''} disabled />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Az e-mail cím nem módosítható.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Név</Label>
                            <Input id="name" name="name" defaultValue={session.user.name || ''} placeholder="Név megadása" />
                        </div>
                        <Button type="submit">Mentés</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
