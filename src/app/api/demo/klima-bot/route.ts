import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface LeadExtraction {
    name?: string | null;
    phone?: string | null;
    city?: string | null;
    propertySize?: string | null;
    needType?: string | null;
    estimatedBudget?: string | null;
    status: "érdeklődő" | "igényfelmérés" | "árajánlat_előkészítve" | "lead_rögzítve";
}

const SYSTEM_PROMPT = `
Te vagy a "KlímaTech Pro" prémium klíma és hőszivattyú vállalkozás intelligens értékesítési és műszaki tanácsadó AI asszisztense (fejlesztette: Backline IT).

CÉLJAID:
1. Segítőkész, közvetlen, de professzionális stílusban segíteni a látogatóknak kiválasztani a megfelelő klímát vagy hőszivattyút.
2. Felmérni a legfontosabb paramétereket:
   - Alapterület (m2) és belmagasság
   - Fűtésre is használja-e (pl. H-tarifa, fűtésre optimalizált modell)
   - Szigetelés állapota
3. Tájékoztató árakat mondani:
   - Általános ökölszabály: 20-35 m2-re ~3.5 kW-os inverteres klíma (beszereléssel együtt kb. 290 000 - 390 000 Ft márka függvényében: pl. Gree, Daikin, Midea).
   - 35-55 m2-re ~5 kW-os modell (kb. 390 000 - 550 000 Ft).
4. ÉRTÉKESÍTÉSI CÉL (LEAD GENERÁLÁS):
   - Minden 2-3. üzenetváltásnál udvariasan ajánld fel a díjmentes helyszíni felmérést vagy a kötelezettségmentes tételes árajánlatot.
   - Kérd el a látogató nevét, telefonszámát és a település nevét!

FONTOS VÁLASZFORMÁTUM:
A válaszod végére MINDIG szúrd be az alábbi rejtett JSON blokkot a kinyert adatokkal:
<<<LEAD_DATA>>>
{
  "name": "ügyfél neve ha megadta, egyébként null",
  "phone": "telefonszám ha megadta, egyébként null",
  "city": "település ha megadta, egyébként null",
  "propertySize": "alapterület pl. 35 m2 ha megadta, egyébként null",
  "needType": "hűtés / hűtés és fűtés / hőszivattyú ha ismert, egyébként null",
  "estimatedBudget": "becsült összeg Ft-ban ha szóba került, egyébként null",
  "status": "érdeklődő" | "igényfelmérés" | "árajánlat_előkészítve" | "lead_rögzítve"
}
<<<END_LEAD_DATA>>>

Ügyelj rá, hogy a válaszod tömör, lendületes és barátságos legyen, ne írj feleslegesen túl hosszú bekezdéseket (max 2-3 rövid bekezdés).
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history = [] } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Üzenet megadása kötelező" }, { status: 400 });
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://hello-6780-resource.services.ai.azure.com/openai/v1";
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

        if (!apiKey) {
            return NextResponse.json({ error: "Azure OpenAI API kulcs hiányzik a konfigurációból" }, { status: 500 });
        }

        // Keep last 8 messages to maintain token cost control
        const trimmedHistory: ChatMessage[] = (Array.isArray(history) ? history.slice(-8) : []).map((m: any) => ({
            role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
            content: String(m.content || "")
        }));

        const messages: ChatMessage[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...trimmedHistory,
            { role: "user", content: message }
        ];

        // Call Azure OpenAI
        const targetUrl = `${endpoint.replace(/\/+$/, "")}/chat/completions`;
        const azureResponse = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                model: deployment,
                messages,
                max_tokens: 500, // strict cost bound
                temperature: 0.7
            })
        });

        if (!azureResponse.ok) {
            const errorText = await azureResponse.text();
            console.error("Azure OpenAI Error:", errorText);
            return NextResponse.json(
                { error: "Hiba az Azure OpenAI hívása közben", details: errorText },
                { status: azureResponse.status }
            );
        }

        const data = await azureResponse.json();
        const rawContent = data.choices?.[0]?.message?.content || "";

        // Parse structured lead data from hidden block
        let leadData: LeadExtraction = { status: "érdeklődő" };
        let cleanReply = rawContent;

        const leadMatch = rawContent.match(/<<<LEAD_DATA>>>([\s\S]*?)<<<END_LEAD_DATA>>>/);
        if (leadMatch) {
            try {
                leadData = JSON.parse(leadMatch[1].trim());
            } catch (err) {
                console.warn("Failed to parse lead data json:", err);
            }
            cleanReply = rawContent.replace(/<<<LEAD_DATA>>>[\s\S]*?<<<END_LEAD_DATA>>>/, "").trim();
        }

        return NextResponse.json({
            reply: cleanReply,
            lead: leadData,
            usage: {
                promptTokens: data.usage?.prompt_tokens,
                completionTokens: data.usage?.completion_tokens,
                totalTokens: data.usage?.total_tokens,
                approxCostHuf: ((data.usage?.total_tokens || 0) * 0.0012).toFixed(2) // approx HUF
            }
        });

    } catch (error: any) {
        console.error("Server API route error:", error);
        return NextResponse.json(
            { error: "Szerverhiba", message: error.message },
            { status: 500 }
        );
    }
}
