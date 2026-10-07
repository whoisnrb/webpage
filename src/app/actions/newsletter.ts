"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";
import { buildNewsletterHtml } from "@/lib/newsletter-template";
import { GOOGLE_SHEET_IDS } from "@/lib/n8n/config";

// --- Helpers ---

function getEmailTransporter() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error("Hiányzó Gmail hozzáférési adatok (GMAIL_USER vagy GMAIL_APP_PASSWORD)");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
    });
}

// --- Subscribers Actions ---

export async function getNewsletterSubscribers() {
    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, subscribers };
    } catch (error: any) {
        console.error("Hiba a feliratkozók lekérésekor:", error);
        return { success: false, error: error.message, subscribers: [] };
    }
}

export async function addSubscriber(email: string, name?: string) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !normalizedEmail.includes("@")) {
            return { success: false, error: "Érvénytelen e-mail cím formátum" };
        }

        const subscriber = await prisma.newsletterSubscriber.upsert({
            where: { email: normalizedEmail },
            create: {
                email: normalizedEmail,
                name: name?.trim() || null,
                active: true,
                source: "admin-manual",
            },
            update: {
                active: true,
                name: name?.trim() || undefined,
            },
        });

        // Ensure lead entry exists too
        const existingLead = await prisma.lead.findUnique({
            where: { email: normalizedEmail },
        });
        if (!existingLead) {
            await prisma.lead.create({
                data: {
                    email: normalizedEmail,
                    name: name?.trim() || null,
                    source: "Hírlevél (Kézi)",
                    status: "LEAD",
                },
            });
        }

        revalidatePath("/admin/newsletter");
        return { success: true, subscriber };
    } catch (error: any) {
        console.error("Hiba feliratkozó hozzáadásakor:", error);
        return { success: false, error: error.message };
    }
}

export async function toggleSubscriberStatus(id: string, active: boolean) {
    try {
        const subscriber = await prisma.newsletterSubscriber.update({
            where: { id },
            data: { active },
        });

        revalidatePath("/admin/newsletter");
        return { success: true, subscriber };
    } catch (error: any) {
        console.error("Hiba státusz módosításakor:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await prisma.newsletterSubscriber.delete({
            where: { id },
        });

        revalidatePath("/admin/newsletter");
        return { success: true };
    } catch (error: any) {
        console.error("Hiba feliratkozó törlésekor:", error);
        return { success: false, error: error.message };
    }
}

export async function syncSubscribersFromSheet() {
    try {
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        let key = process.env.GOOGLE_PRIVATE_KEY;

        if (!email || !key) {
            return { success: false, error: "Hiányzó Google Service Account hitelesítő adatok." };
        }

        if (key.startsWith('"') && key.endsWith('"')) {
            key = key.substring(1, key.length - 1);
        }
        key = key.replace(/\\n/g, "\n");

        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: email, private_key: key },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_IDS.NEWSLETTER,
            range: "A:E",
        });

        const rows = res.data.values || [];
        let addedCount = 0;

        for (const row of rows) {
            if (!row || !row[0]) continue;
            const val = row[0].trim().toLowerCase();
            if (val === "email" || !val.includes("@")) continue;

            const existing = await prisma.newsletterSubscriber.findUnique({
                where: { email: val },
            });

            if (!existing) {
                await prisma.newsletterSubscriber.create({
                    data: {
                        email: val,
                        active: true,
                        source: "google-sheet-sync",
                    },
                });
                addedCount++;
            }
        }

        revalidatePath("/admin/newsletter");
        return { success: true, addedCount };
    } catch (error: any) {
        console.error("Hiba a Google Sheet szinkronizálásakor:", error);
        return { success: false, error: error.message };
    }
}

// --- Campaigns Actions ---

export async function getNewsletterCampaigns() {
    try {
        const campaigns = await prisma.newsletterCampaign.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, campaigns };
    } catch (error: any) {
        console.error("Hiba kampányok lekérésekor:", error);
        return { success: false, error: error.message, campaigns: [] };
    }
}

export async function saveNewsletterCampaign(params: {
    id?: string;
    subject: string;
    previewText?: string;
    content: string;
    status?: string;
}) {
    try {
        const { id, subject, previewText, content, status = "DRAFT" } = params;

        let campaign;
        if (id) {
            campaign = await prisma.newsletterCampaign.update({
                where: { id },
                data: {
                    subject,
                    previewText,
                    content,
                    status,
                },
            });
        } else {
            campaign = await prisma.newsletterCampaign.create({
                data: {
                    subject,
                    previewText,
                    content,
                    status,
                },
            });
        }

        revalidatePath("/admin/newsletter");
        return { success: true, campaign };
    } catch (error: any) {
        console.error("Hiba kampány mentésekor:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteNewsletterCampaign(id: string) {
    try {
        await prisma.newsletterCampaign.delete({
            where: { id },
        });

        revalidatePath("/admin/newsletter");
        return { success: true };
    } catch (error: any) {
        console.error("Hiba kampány törlésekor:", error);
        return { success: false, error: error.message };
    }
}

// --- AI Newsletter Generation ---

export async function generateNewsletterAI(params: {
    topic: string;
    tone?: string;
}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "A Gemini API kulcs nincs beállítva a környezeti változók között.",
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `Te a BacklineIT professzionális hírlevél-író szakértője vagy. A BacklineIT kis- és középvállalkozásoknak nyújt prémium rendszerüzemeltetési, MI automatizációs és szoftverfejlesztési szolgáltatásokat.
A feladatod egy lebilincselő, informatív, érthető és konverziót támogató heti hírlevél megírása magyar nyelven.
KÉRLEK, EGY ÉRVÉNYES JSON OBJEKTUMOT ADJ VISSZA a következő kulcsokkal:
{
  "subject": "Figyelemfelkeltő tárgymező (max 60 karakter)",
  "previewText": "Rövid előnézeti szöveg az email kliensekhez (max 90 karakter)",
  "content": "<p>Bevezető bekezdés...</p><h2>Főbb pontok</h2><p>Magyarázat...</p><ul><li>Pont 1</li><li>Pont 2</li></ul><p>Záró gondolat vagy cselekvésre ösztönzés...</p>",
  "ctaText": "Gomb szöveg (pl. Időpontfoglalás vagy Részletek)",
  "ctaUrl": "https://backlineit.hu/konzultacio"
}
A "content" mezőben csak standard HTML címkék legyenek (p, h2, ul, li, strong, em). Ne tegyél felesleges külső html/body tageket!`;

        const userPrompt = `Írj heti hírlevelet a következő témában: "${params.topic}". Hangnem: ${params.tone || "szakmai, barátságos, gyakorlatias"}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
            },
        });

        const rawText = response.text;
        if (!rawText) throw new Error("Üres válasz az AI modelltől");

        const parsed = JSON.parse(rawText);
        return {
            success: true,
            data: {
                subject: parsed.subject || "Heti IT & Automatizációs Hírek",
                previewText: parsed.previewText || "",
                content: parsed.content || "",
                ctaText: parsed.ctaText || "Konzultáció foglalása",
                ctaUrl: parsed.ctaUrl || "https://backlineit.hu/konzultacio",
            },
        };
    } catch (error: any) {
        console.error("Gemini hírlevél generálási hiba:", error);
        return { success: false, error: error.message };
    }
}

// --- Email Sending Action ---

export async function sendNewsletterCampaign(params: {
    campaignId?: string;
    subject: string;
    previewText?: string;
    content: string;
    ctaText?: string;
    ctaUrl?: string;
    testEmail?: string;
}) {
    try {
        const { campaignId, subject, previewText, content, ctaText, ctaUrl, testEmail } = params;
        const transporter = getEmailTransporter();
        const fromAddress = `"BacklineIT" <${process.env.GMAIL_USER}>`;

        // Case 1: Test Email
        if (testEmail) {
            const normalizedTestEmail = testEmail.trim().toLowerCase();
            const html = buildNewsletterHtml({
                subject,
                previewText: previewText ? `[TESZT] ${previewText}` : "[TESZT KÜLDÉS]",
                content,
                ctaText,
                ctaUrl,
                recipientEmail: normalizedTestEmail,
            });

            await transporter.sendMail({
                from: fromAddress,
                to: normalizedTestEmail,
                subject: `[TESZT] ${subject}`,
                html,
            });

            return {
                success: true,
                test: true,
                count: 1,
                message: `A teszt hírlevél sikeresen elküldve a(z) ${normalizedTestEmail} címre!`,
            };
        }

        // Case 2: Send to all active subscribers
        const subscribers = await prisma.newsletterSubscriber.findMany({
            where: { active: true },
        });

        if (subscribers.length === 0) {
            return {
                success: false,
                error: "Nincs egyetlen aktív feliratkozó sem a rendszerben.",
            };
        }

        let sentCount = 0;
        const failedEmails: string[] = [];

        for (const sub of subscribers) {
            try {
                const html = buildNewsletterHtml({
                    subject,
                    previewText,
                    content,
                    ctaText,
                    ctaUrl,
                    recipientEmail: sub.email,
                });

                await transporter.sendMail({
                    from: fromAddress,
                    to: sub.email,
                    subject,
                    html,
                });

                sentCount++;

                // Small delay between sends to prevent throttling
                if (subscribers.length > 5) {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                }
            } catch (sendErr: any) {
                console.error(`Hiba a levél küldésekor (${sub.email}):`, sendErr);
                failedEmails.push(sub.email);
            }
        }

        // Save or update campaign record
        if (campaignId) {
            await prisma.newsletterCampaign.update({
                where: { id: campaignId },
                data: {
                    subject,
                    previewText,
                    content,
                    status: "SENT",
                    recipientCount: sentCount,
                    sentAt: new Date(),
                },
            });
        } else {
            await prisma.newsletterCampaign.create({
                data: {
                    subject,
                    previewText,
                    content,
                    status: "SENT",
                    recipientCount: sentCount,
                    sentAt: new Date(),
                },
            });
        }

        revalidatePath("/admin/newsletter");

        return {
            success: true,
            test: false,
            count: sentCount,
            totalSubscribers: subscribers.length,
            failedCount: failedEmails.length,
            message: `Hírlevél sikeresen kiküldve ${sentCount} feliratkozónak!`,
        };
    } catch (error: any) {
        console.error("Hiba a hírlevél kampány kiküldésekor:", error);
        return { success: false, error: error.message };
    }
}
