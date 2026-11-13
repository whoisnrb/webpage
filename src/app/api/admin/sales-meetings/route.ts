import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendSalesMeetingNotification } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        
        const clientName = formData.get("clientName") as string;
        const clientEmail = (formData.get("clientEmail") as string) || null;
        const clientPhone = (formData.get("clientPhone") as string) || null;
        const meetingTimeStr = formData.get("meetingTime") as string;
        const platform = (formData.get("platform") as string) || "Telefon";
        const meetingLink = (formData.get("meetingLink") as string) || null;
        const status = (formData.get("status") as string) || "SCHEDULED";
        const notes = (formData.get("notes") as string) || null;
        const notifyRecipient = (formData.get("notifyRecipient") as string) || "roha.levente@backlineit.hu";
        
        if (!clientName) {
            return NextResponse.json({ success: false, error: "Az ügyfél neve kötelező!" }, { status: 400 });
        }
        
        const meetingTime = meetingTimeStr ? new Date(meetingTimeStr) : new Date();
        const document = formData.get("document") as File | null;
        
        let documentData: { documentFile?: Buffer; documentFileName?: string; documentMimeType?: string } = {};
        
        if (document && typeof document === 'object' && document.size > 0) {
            const buffer = Buffer.from(await document.arrayBuffer());
            documentData = {
                documentFile: buffer,
                documentFileName: document.name,
                documentMimeType: document.type,
            };
        }
        
        const meeting = await prisma.salesMeeting.create({
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
        });
        
        // E-mail értesítés küldése a kiválasztott értékesítőnek
        try {
            await sendSalesMeetingNotification(notifyRecipient, {
                clientName,
                clientEmail,
                clientPhone,
                meetingTime,
                platform,
                meetingLink,
                status,
                notes,
                hasDocument: !!documentData.documentFile,
            });
        } catch (emailErr) {
            console.error("[SALES-MEETING-API] Warning: Email notification failed:", emailErr);
        }
        
        revalidatePath("/admin/sales-meetings");
        revalidatePath("/[locale]/admin/sales-meetings", "page");
        
        return NextResponse.json({ success: true, meetingId: meeting.id });
    } catch (error: any) {
        console.error("[SALES-MEETING-API] Error creating sales meeting:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Hiba történt a mentés során." },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const id = formData.get("id") as string;
        
        if (!id) {
            return NextResponse.json({ success: false, error: "A meeting azonosítója hiányzik." }, { status: 400 });
        }
        
        const clientName = formData.get("clientName") as string;
        const clientEmail = (formData.get("clientEmail") as string) || null;
        const clientPhone = (formData.get("clientPhone") as string) || null;
        const meetingTimeStr = formData.get("meetingTime") as string;
        const platform = (formData.get("platform") as string) || "Telefon";
        const meetingLink = (formData.get("meetingLink") as string) || null;
        const status = (formData.get("status") as string) || "SCHEDULED";
        const notes = (formData.get("notes") as string) || null;
        
        const document = formData.get("document") as File | null;
        let documentData: any = {};
        
        if (document && typeof document === 'object' && document.size > 0) {
            const buffer = Buffer.from(await document.arrayBuffer());
            documentData = {
                documentFile: buffer,
                documentFileName: document.name,
                documentMimeType: document.type,
            };
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
        };
        
        if (meetingTimeStr) {
            dataToUpdate.meetingTime = new Date(meetingTimeStr);
        }
        
        await prisma.salesMeeting.update({
            where: { id },
            data: dataToUpdate,
        });
        
        revalidatePath("/admin/sales-meetings");
        revalidatePath("/[locale]/admin/sales-meetings", "page");
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[SALES-MEETING-API] Error updating sales meeting:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Hiba történt a módosítás során." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        
        if (!id) {
            return NextResponse.json({ success: false, error: "A meeting azonosítója hiányzik." }, { status: 400 });
        }
        
        await prisma.salesMeeting.delete({
            where: { id },
        });
        
        revalidatePath("/admin/sales-meetings");
        revalidatePath("/[locale]/admin/sales-meetings", "page");
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[SALES-MEETING-API] Error deleting sales meeting:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Hiba történt a törlés során." },
            { status: 500 }
        );
    }
}
