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


export interface HuntedLead {
    companyName: string;
    name?: string | null;
    email: string;
    phone?: string | null;
    website?: string | null;
    painPoint?: string | null;
    source: string;
}

export async function searchLiveLeadsAction(city: string, category: string) {
    try {
        const query = `${category} ${city} kapcsolat email`;
        const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        });

        const html = await res.text();
        const results: Array<{ title: string; snippet: string; url: string; email?: string | null; phone?: string | null }> = [];
        const regex = /<h2 class="result__title">[\s\S]*?<a class="result__url"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;

        let match;
        while ((match = regex.exec(html)) !== null && results.length < 8) {
            const rawUrl = match[1];
            const rawTitle = match[2].replace(/<[^>]+>/g, '').trim();
            const rawSnippet = match[3].replace(/<[^>]+>/g, '').trim();
            const emailMatch = rawSnippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const phoneMatch = rawSnippet.match(/(?:\+36|06)[\s-]?(?:\d{1,2})[\s-]?\d{3}[\s-]?\d{3,4}/);

            let cleanWebsite = rawTitle;
            if (rawUrl.includes('uddg=')) {
                try {
                    const params = new URLSearchParams(rawUrl.split('?')[1]);
                    const decoded = params.get('uddg');
                    if (decoded) {
                        cleanWebsite = new URL(decoded).hostname.replace('www.', '');
                    }
                } catch {}
            }

            results.push({
                title: rawTitle,
                snippet: rawSnippet,
                url: cleanWebsite,
                email: emailMatch ? emailMatch[0] : null,
                phone: phoneMatch ? phoneMatch[0] : null,
            });
        }

        const azureKey = process.env.AZURE_OPENAI_KEY;
        const azureUrl = process.env.AZURE_OPENAI_ENDPOINT_COMPLETIONS || 'https://hello-6780-resource.services.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';

        if (azureKey && results.length > 0) {
            try {
                const prompt = `Te egy profi B2B adatbányász és cégkutató vagy a Backline IT-nál (webfejlesztő és szoftveres cég).
Az alábbi valós keresési találatokból (város: ${city}, kategória: ${category}) állíts össze tiszta, valós céges leadeket.

Keresési adatok:
${JSON.stringify(results, null, 2)}

Válaszolj KIZÁRÓLAG egy érvényes JSON tömbbel az alábbi kulcsokkal (ha nincs közvetlen e-mail, próbáld meg az info@domain vagy kapcsolat@domain címet feltételezni vagy a cég nevéből képezni):
[
  {
    "companyName": "Cégnév",
    "name": "Döntéshozó / Orvos / Ügyvéd neve ha ismert, vagy null",
    "email": "Valós e-mail cím (pl. info@ceg.hu)",
    "phone": "Telefonszám vagy null",
    "website": "Weboldal címe",
    "painPoint": "1 mondat arról, milyen digitális hiányossága / lehetősége lehet a cégnek (pl. elavult dizájn, hiányzó online időpontfoglaló, lassú betöltés)"
  }
]`;

                const aiRes = await fetch(azureUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': azureKey,
                    },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.2,
                    }),
                });

                if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    let aiText = aiData.choices[0]?.message?.content?.trim() || '';
                    if (aiText.startsWith('```json')) {
                        aiText = aiText.replace(/^```json/, '').replace(/```$/, '').trim();
                    } else if (aiText.startsWith('```')) {
                        aiText = aiText.replace(/^```/, '').replace(/```$/, '').trim();
                    }
                    const parsed = JSON.parse(aiText);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return {
                            success: true,
                            leads: parsed.map((item: any) => ({
                                companyName: item.companyName || `${category} - ${city}`,
                                name: item.name || null,
                                email: item.email || `info@${(item.website || 'ceg.hu').replace(/^https?:\/\//, '').split('/')[0]}`,
                                phone: item.phone || null,
                                website: item.website || null,
                                painPoint: item.painPoint || "Potenciális weboldal modernizáció és digitális automatizáció.",
                                source: "Google Maps Vadász",
                            })) as HuntedLead[],
                        };
                    }
                }
            } catch (aiErr) {
                console.error("AI parsing failed, using fallback regex:", aiErr);
            }
        }

        // Fallback: build leads from raw search results
        const fallbackLeads: HuntedLead[] = results.map((r, i) => {
            const domain = r.url.replace(/^https?:\/\//, '').split('/')[0] || `ceg${i + 1}.hu`;
            return {
                companyName: r.title.replace(/\.[a-z]{2,3}(\/.*)?$/i, '').replace(/kapcsolat/i, '').trim() || `${category} #${i + 1}`,
                name: null,
                email: r.email || `info@${domain}`,
                phone: r.phone || null,
                website: domain,
                painPoint: "A vállalkozás jelenlegi weboldala lassú betöltésű vagy nem rendelkezik modern online konverziós struktúrával.",
                source: "Google Maps Vadász",
            };
        });

        return { success: true, leads: fallbackLeads };
    } catch (error: any) {
        console.error("Error searching live leads:", error);
        return { success: false, error: error.message || "Nem sikerült a leadek keresése" };
    }
}

export async function importHuntedLeadAction(data: {
    companyName?: string;
    name?: string;
    email: string;
    source: string;
    notes?: string;
}) {
    try {
        const cleanEmail = data.email.trim().toLowerCase();
        const existing = await prisma.lead.findUnique({
            where: { email: cleanEmail },
        });

        if (existing) {
            return { success: true, lead: existing, alreadyExisted: true };
        }

        const lead = await prisma.lead.create({
            data: {
                companyName: data.companyName,
                name: data.name,
                email: cleanEmail,
                source: data.source || "Google Maps Vadász",
                notes: data.notes,
                status: "LEAD",
            },
        });

        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead, alreadyExisted: false };
    } catch (error: any) {
        console.error("Error importing hunted lead:", error);
        return { success: false, error: error.message || "Nem sikerült az importálás" };
    }
}

export async function analyzeFacebookLeadAction(postText: string, posterName?: string) {
    try {
        const azureKey = process.env.AZURE_OPENAI_KEY;
        const azureUrl = process.env.AZURE_OPENAI_ENDPOINT_COMPLETIONS || 'https://hello-6780-resource.services.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';

        let analysis = {
            detectedNeed: "Weboldal készítés / felújítás",
            suggestedComment: `Szia ${posterName ? posterName.split(' ')[0] : ''}! Szabó Ábel vagyok a Backline IT-tól.
Büszkék vagyunk rá, hogy a Microsoft által hivatalosan elismert és támogatott startup vagyunk, és szolgáltatásainkat alanyi adómentesen (AAM) nyújtjuk – így munkadíjunkat nem terheli +27% áfa.

Minden munkánkra 90 napos díjmentes garanciát adunk, referenciáinkat itt tudod megnézni:
👉 https://backlineit.hu/referenciak

Írj nyugodtan privát üzenetet, vagy foglalj egy 30 perces ingyenes konzultációt, és átbeszéljük a részleteket!`,
        };

        if (azureKey) {
            try {
                const prompt = `Elemezd az alábbi magyar Facebook csoport posztot, amit egy vállalkozó írt:
Poszt szövege: "${postText}"
Posztoló neve: "${posterName || 'Érdeklődő'}"

Készíts:
1. "detectedNeed": 1 rövid mondatos összefoglaló, mit keres a posztoló (pl. webshop készítés, weboldal gyorsítás, egyedi rendszer).
2. "suggestedComment": Egy professzionális, közvetlen és meggyőző Facebook komment / Messenger válasz Szabó Ábel (Backline IT) nevében. Említsd meg az Áfamentes számlázást (nem terheli +27% ÁFA), a Microsoft for Startups elismerést, és a referenciák linkjét: https://backlineit.hu/referenciak.

Válaszolj érvényes JSON formátumban: {"detectedNeed": "...", "suggestedComment": "..."}`;

                const aiRes = await fetch(azureUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'api-key': azureKey },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                    }),
                });

                if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    let aiText = aiData.choices[0]?.message?.content?.trim() || '';
                    if (aiText.startsWith('```json')) aiText = aiText.replace(/^```json/, '').replace(/```$/, '').trim();
                    else if (aiText.startsWith('```')) aiText = aiText.replace(/^```/, '').replace(/```$/, '').trim();
                    const parsed = JSON.parse(aiText);
                    if (parsed.suggestedComment) analysis = parsed;
                }
            } catch (err) {
                console.error("AI Facebook analysis error:", err);
            }
        }

        return { success: true, analysis };
    } catch (error: any) {
        console.error("Error analyzing Facebook lead:", error);
        return { success: false, error: error.message };
    }
}
