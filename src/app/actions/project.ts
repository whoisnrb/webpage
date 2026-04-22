"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateProjectStatus(projectId: string, status: string, progress: number) {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status,
                progress
            }
        })
        
        revalidatePath("/admin/projects")
        revalidatePath("/dashboard/projects")
        
        return { success: true }
    } catch (error) {
        console.error("Error updating project:", error)
        return { success: false, error: "Failed to update project" }
    }
}
