"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSalesMeetings() {
    try {
        const meetings = await prisma.salesMeeting.findMany({
            orderBy: {
                meetingTime: 'asc'
            }
        })
        
        // Mivel a documentFile egy Buffer, ezért ne küldjük le alapból az egészet, csak ha le akarják tölteni
        return meetings.map(({ documentFile, ...rest }) => ({
            ...rest,
            hasDocument: !!documentFile
        }))
    } catch (error) {
        console.error("Error fetching sales meetings:", error)
        throw new Error("Failed to fetch meetings")
    }
}

export async function createSalesMeeting(formData: FormData) {
    try {
        const clientName = formData.get("clientName") as string
        const clientEmail = formData.get("clientEmail") as string | null
        const clientPhone = formData.get("clientPhone") as string | null
        const meetingTime = new Date(formData.get("meetingTime") as string)
        const platform = formData.get("platform") as string
        const meetingLink = formData.get("meetingLink") as string | null
        const status = formData.get("status") as string
        const notes = formData.get("notes") as string | null
        
        const document = formData.get("document") as File | null
        
        let documentData: { documentFile?: Buffer, documentFileName?: string, documentMimeType?: string } = {}
        
        if (document && document.size > 0) {
            const buffer = Buffer.from(await document.arrayBuffer())
            documentData = {
                documentFile: buffer,
                documentFileName: document.name,
                documentMimeType: document.type,
            }
        }
        
        await prisma.salesMeeting.create({
            data: {
                clientName,
                clientEmail,
                clientPhone,
                meetingTime,
                platform,
                meetingLink,
                status,
                notes,
                ...documentData,
            }
        })
        
        revalidatePath("/admin/sales-meetings")
        return { success: true }
    } catch (error) {
        console.error("Error creating meeting:", error)
        return { success: false, error: "Failed to create meeting" }
    }
}

export async function updateSalesMeeting(id: string, formData: FormData) {
    try {
        const clientName = formData.get("clientName") as string
        const clientEmail = formData.get("clientEmail") as string | null
        const clientPhone = formData.get("clientPhone") as string | null
        const meetingTimeStr = formData.get("meetingTime") as string
        const platform = formData.get("platform") as string
        const meetingLink = formData.get("meetingLink") as string | null
        const status = formData.get("status") as string
        const notes = formData.get("notes") as string | null
        
        const document = formData.get("document") as File | null
        
        let documentData: any = {}
        
        if (document && document.size > 0) {
            const buffer = Buffer.from(await document.arrayBuffer())
            documentData = {
                documentFile: buffer,
                documentFileName: document.name,
                documentMimeType: document.type,
            }
        }
        
        const dataToUpdate: any = {
            clientName,
            clientEmail,
            clientPhone,
            platform,
            meetingLink,
            status,
            notes,
            ...documentData,
        }
        
        if (meetingTimeStr) {
            dataToUpdate.meetingTime = new Date(meetingTimeStr)
        }
        
        await prisma.salesMeeting.update({
            where: { id },
            data: dataToUpdate
        })
        
        revalidatePath("/admin/sales-meetings")
        return { success: true }
    } catch (error) {
        console.error("Error updating meeting:", error)
        return { success: false, error: "Failed to update meeting" }
    }
}

export async function deleteSalesMeeting(id: string) {
    try {
        await prisma.salesMeeting.delete({
            where: { id }
        })
        revalidatePath("/admin/sales-meetings")
        return { success: true }
    } catch (error) {
        console.error("Error deleting meeting:", error)
        return { success: false, error: "Failed to delete meeting" }
    }
}
