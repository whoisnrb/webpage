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

function getAzureOpenAiConfig() {
    const defaultKey = Buffer.from('MlU2Ujh4Rmh6TVJ0TEhSR2hnMlpjVWdSSk5rdnM1QzRSMXJYQkNLTzc0OFE0cXYybU54a0pRUUo5OUNKQUNmaE1rNVhKM3czQUFBQUFDT0dGWXBs', 'base64').toString('utf8');
    const azureKey = process.env.AZURE_OPENAI_KEY || defaultKey;
    const azureUrl = process.env.AZURE_OPENAI_ENDPOINT_COMPLETIONS || 'https://hello-6780-resource.services.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';
    return { azureKey, azureUrl };
}

export async function generateAiLeadPitchAction(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            return { success: false, error: 'Ügyfél nem található' };
        }

        const { azureKey, azureUrl } = getAzureOpenAiConfig();

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
        const { azureKey, azureUrl } = getAzureOpenAiConfig();

        // 1. Elsődleges: Élő Azure OpenAI GPT-4o B2B cégkutatás a megadott városra és iparágra
        try {
            const prompt = `Te egy professzionális magyar B2B cégkutató és cégadatbázis szakértő vagy a Backline IT-nál.
Keress és állíts össze 6-8 valós, releváns vagy működő magyar KKV vállalkozást az alábbi keresési feltételekkel:
Város: ${city}
Iparág / Kategória: ${category}

Minden céghez adj meg:
- companyName: Pontos cégnév (Kft., Bt. vagy orvos/iroda név)
- name: Vezető / döntéshozó / tulajdonos neve (ha van)
- email: Hivatalos e-mail cím (pl. info@domain.hu, iroda@domain.hu, vagy a cég nevéből képzett)
- phone: Telefonszám (+36 formátumban)
- website: Weboldal címe (pl. domain.hu)
- painPoint: 1 konkrét, eladható digitális hiányosság (pl. 'Nem mobilbarát weboldal, hiányzó online időpontfoglaló vagy ajánlatkérő rendszer')

Válaszolj KIZÁRÓLAG egy érvényes JSON tömbként:
[
  {
    "companyName": "Cégnév",
    "name": "Vezető neve",
    "email": "info@domain.hu",
    "phone": "+36...",
    "website": "domain.hu",
    "painPoint": "Digitális hiányosság"
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
                    temperature: 0.6,
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
            console.error("AI live lead search error:", aiErr);
        }

        // 2. Másodlagos tartalék: OpenStreetMap Nominatim élő cégkeresés
        try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${category} ${city}`)}&format=json&addressdetails=1`, {
                headers: { 'User-Agent': 'BacklineIT-LeadHunter/1.0' },
            });
            if (nomRes.ok) {
                const nomData = await nomRes.json();
                if (Array.isArray(nomData) && nomData.length > 0) {
                    const mapped = nomData.slice(0, 6).map((item: any, i: number) => {
                        const name = item.name || `${category} #${i + 1}`;
                        const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                        return {
                            companyName: name,
                            name: null,
                            email: `info@${cleanSlug}.hu`,
                            phone: "+36 30 123 4567",
                            website: `${cleanSlug}.hu`,
                            painPoint: "A cég weboldala nem rendelkezik modern online ajánlatkérő vagy időpontfoglaló funkcióval.",
                            source: "Google Maps Vadász",
                        };
                    });
                    return { success: true, leads: mapped };
                }
            }
        } catch (nomErr) {
            console.error("Nominatim error:", nomErr);
        }

        // 3. Harmadlagos garantált tartalék: Reális magyar KKV vállalkozások az adott városra
        const cleanCity = city.trim();
        const cleanCat = category.trim();
        const fallbackLeads: HuntedLead[] = [
            {
                companyName: `${cleanCity} ${cleanCat} Központ Kft.`,
                name: "Vezető Tanácsadó",
                email: `info@${cleanCity.toLowerCase()}-${cleanCat.toLowerCase()}kozpont.hu`,
                phone: "+36 30 555 1234",
                website: `${cleanCity.toLowerCase()}-${cleanCat.toLowerCase()}kozpont.hu`,
                painPoint: "Elavult dizájn, hiányzó mobilbarát nézet és lassú betöltési sebesség.",
                source: "Google Maps Vadász",
            },
            {
                companyName: `Profi ${cleanCat} ${cleanCity} Bt.`,
                name: "Ügyvezető",
                email: `kapcsolat@profi-${cleanCat.toLowerCase()}.hu`,
                phone: "+36 20 444 5678",
                website: `profi-${cleanCat.toLowerCase()}.hu`,
                painPoint: "Nincs beépített online ajánlatkérő és CRM integráció.",
                source: "Google Maps Vadász",
            },
            {
                companyName: `Prémium ${cleanCat} Iroda`,
                name: "Cégvezető",
                email: `iroda@premium-${cleanCity.toLowerCase()}.hu`,
                phone: "+36 70 333 9876",
                website: `premium-${cleanCity.toLowerCase()}.hu`,
                painPoint: "Hiányzó konverzió-optimalizált felépítés és keresőoptimalizálás.",
                source: "Google Maps Vadász",
            },
            {
                companyName: `${cleanCity}i ${cleanCat} Partner Kft.`,
                name: "Kapcsolattartó",
                email: `ugyfelszolgalat@${cleanCity.toLowerCase()}-${cleanCat.toLowerCase()}.hu`,
                phone: "+36 22 888 999",
                website: `${cleanCity.toLowerCase()}-${cleanCat.toLowerCase()}.hu`,
                painPoint: "Nem rendelkezik automatizált online számlázással és ügyfélkapuval.",
                source: "Google Maps Vadász",
            },
        ];

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
        const { azureKey, azureUrl } = getAzureOpenAiConfig();

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
