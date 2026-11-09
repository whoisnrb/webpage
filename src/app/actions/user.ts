"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateProfile(name: string) {
    const session = await auth()
    
    if (!session?.user?.email) {
        return { success: false, error: "Nem vagy bejelentkezve!" }
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
        return { success: false, error: "A név nem lehet üres!" }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { name: trimmedName },
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/settings")

        return { success: true }
    } catch (error) {
        console.error("Hiba a profil frissítésekor:", error)
        return { success: false, error: "Nem sikerült elmenteni az adatokat." }
    }
}
