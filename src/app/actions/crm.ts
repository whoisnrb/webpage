"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isPlaceholderEmail } from "@/lib/utils";

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
        const updateData: any = { ...data };

        if (data.email !== undefined) {
            let cleanEmail = data.email.trim().toLowerCase();
            if (!cleanEmail || isPlaceholderEmail(cleanEmail)) {
                const current = await prisma.lead.findUnique({ where: { id } });
                if (current && isPlaceholderEmail(current.email)) {
                    delete updateData.email;
                } else {
                    const randomSuffix = Math.random().toString(36).substring(2, 8);
                    updateData.email = `nincsmeg-${Date.now()}-${randomSuffix}@crm.internal`;
                }
            } else {
                const existing = await prisma.lead.findUnique({
                    where: { email: cleanEmail },
                });
                if (existing && existing.id !== id) {
                    const partnerName = existing.companyName || existing.name || "Névtelen partner";
                    return {
                        success: false,
                        error: `Ezzel az e-mail címmel (${cleanEmail}) már létezik egy másik partner (${partnerName})!`,
                    };
                }
                updateData.email = cleanEmail;
            }
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: updateData,
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead: updatedLead };
    } catch (error: any) {
        console.error("Error updating lead:", error);
        if (error?.code === "P2002") {
            return { success: false, error: "Ez az e-mail cím már foglalt egy másik partnernél!" };
        }
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
    email?: string;
    source?: string;
    status?: string;
    notes?: string;
}) {
    try {
        let cleanEmail = data.email?.trim().toLowerCase() || "";

        // Ha nincs megadva e-mail cím vagy helykitöltő cím (pl. nincsmeg@teszt.hu, nincsmeg...)
        if (!cleanEmail || isPlaceholderEmail(cleanEmail)) {
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            cleanEmail = `nincsmeg-${Date.now()}-${randomSuffix}@crm.internal`;
        } else {
            // Valós e-mailnél ellenőrizzük, hogy létezik-e már a rendszerben
            const existing = await prisma.lead.findUnique({
                where: { email: cleanEmail },
            });
            if (existing) {
                const partnerName = existing.companyName || existing.name || "Névtelen partner";
                return {
                    success: false,
                    error: `Ezzel az e-mail címmel (${cleanEmail}) már létezik egy partner a CRM-ben: "${partnerName}"!`,
                };
            }
        }

        const lead = await prisma.lead.create({
            data: {
                name: data.name?.trim() || undefined,
                companyName: data.companyName?.trim() || undefined,
                email: cleanEmail,
                source: data.source || "Kézi felvitel",
                status: data.status || "LEAD",
                notes: data.notes?.trim() || undefined,
            },
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead };
    } catch (error: any) {
        console.error("Error creating lead:", error);
        if (error?.code === "P2002") {
            return {
                success: false,
                error: "Ezzel az e-mail címmel már létezik partner a rendszerben!",
            };
        }
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

        if (isPlaceholderEmail(lead.email)) {
            return {
                success: false,
                error: 'Ehhez a partnerhez nincs valós e-mail cím megadva (helyettesítő cím), így nem küldhető ki e-mail.'
            };
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
    verifiedIssues?: string[];
    loadTimeMs?: number;
    hasSsl?: boolean;
    verified?: boolean;
    source: string;
}

function getGeminiApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
}

export async function searchLiveLeadsAction(city: string, category: string) {
    try {
        const cleanCity = city.trim();
        const cleanCat = category.trim();
        if (!cleanCity || !cleanCat) {
            return { success: false, error: "Add meg a várost és az iparágat is!" };
        }

        const { inspectAndAuditLiveWebsite, isBlockedOrDirectoryHost } = await import("@/lib/lead-verifier");

        type CandidateCompany = { companyName: string; website: string; name?: string | null };
        const candidates: CandidateCompany[] = [];
        const seenHosts = new Set<string>();

        const addCandidate = (companyName: string, rawWebsite: string, contactName?: string | null) => {
            if (!rawWebsite) return;
            const host = rawWebsite.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
            if (!host || !host.includes(".") || isBlockedOrDirectoryHost(host) || seenHosts.has(host)) {
                return;
            }
            seenHosts.add(host);
            candidates.push({
                companyName: companyName.trim() || host,
                website: rawWebsite.trim(),
                name: contactName || null,
            });
        };

        const isCountryWide = ["magyarország", "magyarorszag", "hungary", "országos", "orszagos"].includes(cleanCity.toLowerCase());

        // 1. & 2. Párhuzamos élő webkeresés: Gemini Google Search Grounding + Bing élő webkeresés
        const runGeminiDiscovery = async () => {
            const geminiKey = getGeminiApiKey();
            if (!geminiKey) return;

            const regionHint = isCountryWide
                ? "Magyarország (különböző magyar városokban, pl. Budapest, Győr, Debrecen, Szeged, Pécs, Székesfehérvár)"
                : cleanCity;

            const prompt = `Használd a Google keresőt! Keress 10 VALÓDI, jelenleg működő vállalkozást ebben a régióban és szakterületen:
Régió / Város: ${regionHint}
Iparág / Tevékenység: ${cleanCat}

SZIGORÚ SZABÁLYOK:
- KIZÁRÓLAG olyan cégeket adj meg, amelyeket ténylegesen megtaláltál a Google keresésben és saját, önálló weboldaluk van!
- TILOS cégkatalógusokat, webshop-árösszehasonlítókat vagy állami/gyűjtőoldalakat megadni (tilos: aranyoldalak, ceginformacio, opten, joszaki, szaki, facebook, instagram, profession, startlap, wikipedia, cylex, magyarorszag.hu, arukereso).
- TILOS kitalálni cégnevet vagy URL-t!

Válaszolj KIZÁRÓLAG egy érvényes JSON tömbként (egyéb szöveg nélkül):
[
  {
    "companyName": "A cég valódi neve a Google találatból",
    "website": "https://valodi-weboldal.hu",
    "name": "Kapcsolattartó neve ha látszik a találatban, egyébként null"
  }
]`;

            const geminiModels = ["gemini-2.5-flash", "gemini-3-flash-preview"];
            for (let attempt = 0; attempt < geminiModels.length; attempt++) {
                const model = geminiModels[attempt];
                try {
                    const gemRes = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiKey)}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            signal: AbortSignal.timeout(10000),
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }],
                                tools: [{ google_search: {} }],
                                generationConfig: { temperature: 0.1 },
                            }),
                        }
                    );

                    if (gemRes.status === 503 || gemRes.status === 429) {
                        await new Promise((r) => setTimeout(r, 500));
                        continue;
                    }

                    if (gemRes.ok) {
                        const gemData = await gemRes.json();
                        const parts = gemData.candidates?.[0]?.content?.parts || [];
                        const rawText = parts.map((p: any) => p?.text || "").join("\n");
                        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
                        if (jsonMatch) {
                            try {
                                const parsed = JSON.parse(jsonMatch[0]);
                                if (Array.isArray(parsed)) {
                                    for (const item of parsed) {
                                        if (item?.website) {
                                            addCandidate(item.companyName || cleanCat, String(item.website), item.name || null);
                                        }
                                    }
                                }
                            } catch {
                                // Ignore malformed JSON snippet and try extracting grounding URLs
                            }
                        }

                        const chunks = gemData.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                        for (const ch of chunks) {
                            const uri = ch?.web?.uri;
                            const title = ch?.web?.title;
                            if (uri && title && !uri.includes("vertexaisearch.cloud.google.com")) {
                                addCandidate(String(title).split("-")[0].split("|")[0].trim(), String(uri), null);
                            }
                        }
                        break;
                    }
                } catch (gemErr) {
                    console.error(`Gemini Search (${model}) error:`, gemErr);
                }
            }
        };

        const runBingDiscovery = async () => {
            try {
                const bingQuery = isCountryWide
                    ? `${cleanCat} kapcsolat elérhetőség site:.hu`
                    : `${cleanCat} ${cleanCity} kapcsolat weboldal`;
                const bingRes = await fetch(
                    `https://www.bing.com/search?q=${encodeURIComponent(bingQuery)}&setlang=hu&cc=HU&count=25`,
                    {
                        signal: AbortSignal.timeout(7000),
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                            "Accept-Language": "hu-HU,hu;q=0.9",
                        },
                    }
                );
                if (bingRes.ok) {
                    const bingHtml = await bingRes.text();
                    const algoMatches = Array.from(bingHtml.matchAll(/<li class="b_algo"[\s\S]*?<h2><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g));
                    for (const m of algoMatches) {
                        let rawHref = m[1].replace(/&amp;/g, "&");
                        const uMatch = rawHref.match(/[?&]u=a1([^&]+)/);
                        if (uMatch) {
                            try {
                                rawHref = Buffer.from(uMatch[1], "base64url").toString("utf8");
                            } catch {
                                continue;
                            }
                        }
                        if (!rawHref.startsWith("http") || rawHref.includes("bing.com") || rawHref.includes("microsoft.com")) {
                            continue;
                        }
                        const rawTitle = m[2].replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d))).trim();
                        const cleanTitle = rawTitle.split(" - ")[0].split(" | ")[0].trim();
                        addCandidate(cleanTitle || cleanCat, rawHref, null);
                    }
                }
            } catch (bingErr) {
                console.error("Bing search fallback error:", bingErr);
            }
        };

        await Promise.allSettled([runGeminiDiscovery(), runBingDiscovery()]);

        // 3. Harmadlagos valódi forrás: OpenStreetMap Overpass API (csak ha nagyon kevés jelölt jött össze)
        if (candidates.length < 4) {
            try {
                const overpassCity = isCountryWide ? "Budapest" : cleanCity;
                const overpassQuery = `[out:json][timeout:8];
area["name"="${overpassCity}"]["admin_level"~"^(6|8|9)$"]->.searchArea;
(
  node(area.searchArea)["website"];
  way(area.searchArea)["website"];
  node(area.searchArea)["contact:website"];
  way(area.searchArea)["contact:website"];
);
out tags 60;`;
                const ovRes = await fetch("https://overpass-api.de/api/interpreter", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "BacklineIT-LeadHunter/2.0" },
                    body: `data=${encodeURIComponent(overpassQuery)}`,
                    signal: AbortSignal.timeout(8500),
                });
                if (ovRes.ok) {
                    const ovData = await ovRes.json();
                    const catTokens = cleanCat.toLowerCase().split(/\s+/).filter((t) => t.length >= 3);
                    for (const el of ovData.elements || []) {
                        const tags = el.tags || {};
                        const site = tags.website || tags["contact:website"];
                        const elName = tags.name || tags["name:hu"] || "";
                        const tagDump = JSON.stringify(tags).toLowerCase();
                        if (site && elName && catTokens.some((tok) => tagDump.includes(tok.slice(0, Math.max(4, tok.length - 2))))) {
                            addCandidate(elName, site, null);
                        }
                    }
                }
            } catch (ovErr) {
                console.error("Overpass fallback error:", ovErr);
            }
        }

        if (candidates.length === 0) {
            return {
                success: false,
                error: `Nem található élő, saját weboldallal rendelkező vállalkozás a(z) "${cleanCity} - ${cleanCat}" keresésre. Próbálj másik szakterületet vagy várost.`,
            };
        }

        // 4. KÖTELEZŐ ÉLŐ ELLENŐRZÉS: Minden egyes weboldalt letöltünk, kiszűrjük a halott/parkolt oldalakat,
        // kinyerjük a VALÓDI emailt/telefont, és valódi technikai hibadiagnosztikát futtatunk!
        const inspectionResults = await Promise.allSettled(
            candidates.slice(0, 14).map(async (cand) => {
                const audited = await inspectAndAuditLiveWebsite(cand.website);
                if (!audited) return null;

                return {
                    companyName: cand.companyName,
                    name: cand.name || null,
                    email: audited.email || "",
                    phone: audited.phone || null,
                    website: audited.hostname,
                    painPoint: audited.primaryPainPoint,
                    verifiedIssues: audited.verifiedIssues,
                    loadTimeMs: audited.loadTimeMs,
                    hasSsl: audited.hasSsl,
                    verified: true,
                    source: "Google & Web Élő Keresés",
                } as HuntedLead;
            })
        );

        const verifiedLeads: HuntedLead[] = [];
        for (const r of inspectionResults) {
            if (r.status === "fulfilled" && r.value !== null) {
                verifiedLeads.push(r.value);
            }
        }

        if (verifiedLeads.length === 0) {
            return {
                success: false,
                error: `A talált jelölt weboldalak közül egyik sem volt elérhető vagy aktív (parkolt/hibás domainek kiszűrve). Próbálj másik keresési kulcsszót!`,
            };
        }

        return { success: true, leads: verifiedLeads };
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
        let cleanEmail = (data.email || "").trim().toLowerCase();
        if (!cleanEmail || isPlaceholderEmail(cleanEmail)) {
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            cleanEmail = `nincsmeg-${Date.now()}-${randomSuffix}@crm.internal`;
        }

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
