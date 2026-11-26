"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sendStatusUpdateEmail } from "@/lib/mail"
import { headers } from "next/headers"
import { getLocale } from "next-intl/server"

export async function updateProjectStatus(projectId: string, status: string, progress: number) {
    const session = await auth()
    const role = session?.user?.role || ""
    
    if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER"].includes(role)) {
        throw new Error("Unauthorized")
    }

    try {
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: { user: true }
        })

        if (!existingProject) {
            return { success: false, error: "Project not found" }
        }

        await prisma.project.update({
            where: { id: projectId },
            data: {
                status,
                progress
            }
        })
        
        // Trigger email if status changed OR progress reached 100% (and wasn't 100% before)
        const statusChanged = existingProject.status !== status;
        const justCompleted = progress === 100 && existingProject.progress !== 100;

        if ((statusChanged || justCompleted) && existingProject.user?.email) {
            const headerList = await headers()
            const host = headerList.get("host") || ""
            const detectedLocale = await getLocale()
            const locale = host.includes("backlineit.com") || detectedLocale === "en" ? "en" : "hu"
            await sendStatusUpdateEmail(
                existingProject.user.email,
                existingProject.user.name || (locale === "en" ? "Client" : "Ügyfél"),
                existingProject.title,
                status,
                progress,
                locale
            );
        }

        revalidatePath("/admin/projects")
        revalidatePath("/dashboard/projects")
        
        return { success: true }
    } catch (error) {
        console.error("Error updating project:", error)
        return { success: false, error: "Failed to update project" }
    }
}
