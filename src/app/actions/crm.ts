"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getLeads() {
    try {
        return await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return [];
    }
}

export async function updateLead(id: string, data: {
    name?: string;
    companyName?: string;
    email?: string;
    status?: string;
    notes?: string;
    lastContactedAt?: Date;
}) {
    try {
        const updatedLead = await prisma.lead.update({
            where: { id },
            data,
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead: updatedLead };
    } catch (error) {
        console.error("Error updating lead:", error);
        return { success: false, error: "Nem sikerült a frissítés" };
    }
}

export async function deleteLead(id: string) {
    try {
        await prisma.lead.delete({
            where: { id },
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true };
    } catch (error) {
        console.error("Error deleting lead:", error);
        return { success: false, error: "Nem sikerült a törlés" };
    }
}

export async function createLead(data: {
    name?: string;
    companyName?: string;
    email: string;
    source: string;
    status?: string;
    notes?: string;
}) {
    try {
        const lead = await prisma.lead.create({
            data,
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead };
    } catch (error) {
        console.error("Error creating lead:", error);
        return { success: false, error: "Nem sikerült a létrehozás" };
    }
}


export async function sendOutreachEmailAction(leadId: string, customIntro?: string, customSubject?: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead || !lead.email) {
            return { success: false, error: 'Ügyfél nem található vagy hiányzik az e-mail cím' };
        }

        const { sendAbelOutreachEmail } = await import('@/lib/mail');
        const mailResult = await sendAbelOutreachEmail({
            to: lead.email,
            clientName: lead.name || undefined,
            companyName: lead.companyName || undefined,
            customIntro: customIntro || undefined,
            subject: customSubject || undefined,
        });

        if (!mailResult.success) {
            return { success: false, error: mailResult.error || 'Nem sikerült az e-mail kiküldése' };
        }

        const existingNotes = lead.notes || '';
        const timestamp = new Date().toLocaleString('hu-HU');
        const updatedNotes = (existingNotes + '\n[' + timestamp + '] Hideg e-mail kiküldve szabo.abel@backlineit.hu címről.').trim();

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                status: lead.status === 'LEAD' ? 'AJÁNLAT' : lead.status,
                lastContactedAt: new Date(),
                notes: updatedNotes,
            },
        });

        revalidatePath('/[locale]/admin/crm', 'page');
        return { success: true, lead: updatedLead };
    } catch (error: any) {
        console.error('Error sending outreach email action:', error);
        return { success: false, error: error.message || 'Hiba a megkeresés során' };
    }
}

export async function generateAiLeadPitchAction(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            return { success: false, error: 'Ügyfél nem található' };
        }

        const azureKey = process.env.AZURE_OPENAI_KEY;
        const azureUrl = process.env.AZURE_OPENAI_ENDPOINT_COMPLETIONS || 'https://hello-6780-resource.services.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';

        if (!azureKey) {
            return {
                success: false,
                fallback: 'A vállalkozásuk online jelenlétét elemezve figyeltünk fel a weboldalukra. Észrevettük, hogy mind a mobil betöltési sebesség, mind az ügyfélszerzési folyamatok terén olyan közvetlen fejlesztési pontok azonosíthatók, amelyekkel azonnal növelhető a beérkező megkeresések száma.',
            };
        }

        const prompt = 'Te a Backline IT (Microsoft által elismert startup) vezető B2B értékesítési szakértője vagy.\n' +
            'Írj egy pontos, közvetlen, meggyőző és udvarias 1-2 mondatos nyitó mondatot a hideg e-mailhez az alábbi cégnek.\n' +
            'Cégnév: ' + (lead.companyName || 'a vállalkozás') + '\n' +
            'Kapcsolattartó neve: ' + (lead.name || 'Cégvezető') + '\n' +
            'Forrás: ' + lead.source + '\n' +
            'Meglévő jegyzetek / infó: ' + (lead.notes || 'Lassú honlap vagy manuális számlázási/adminisztrációs terhelés') + '\n\n' +
            'A nyitó mondat legyen releváns, ne sablonos, tapintson rá egy valós problémára (pl. lassú weboldal betöltés miatti vásárlóvesztés vagy manuális adminisztráció).\n' +
            'Válaszolj KIZÁRÓLAG a megírt 1-2 mondattal!';

        const response = await fetch(azureUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': azureKey,
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error('Azure OpenAI hiba: ' + err);
        }

        const data = await response.json();
        const intro = data.choices[0]?.message?.content?.trim() || '';

        return { success: true, intro };
    } catch (error: any) {
        console.error('Error generating AI lead pitch:', error);
        return {
            success: false,
            fallback: 'A vállalkozásuk online jelenlétét vizsgálva figyeltem fel a weboldalukra. Észrevettük, hogy a mobil betöltési sebességük jelenleg elmarad a modern sztenderdektől, ami miatt sok potenciális érdeklődő még a vásárlás előtt visszafordulhat.',
        };
    }
}
