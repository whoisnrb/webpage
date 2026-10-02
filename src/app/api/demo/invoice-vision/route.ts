import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image, locale = "hu" } = body;

        if (!image || typeof image !== "string") {
            return NextResponse.json(
                { error: "Kép megadása kötelező (base64 data URL vagy kép link)" },
                { status: 400 }
            );
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://hello-6780-resource.services.ai.azure.com/openai/v1";
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

        if (!apiKey) {
            return NextResponse.json({ error: "Azure OpenAI API kulcs hiányzik" }, { status: 500 });
        }

        const isEn = locale === "en";

        const systemPrompt = isEn
            ? `You are an enterprise invoice, receipt, and document OCR extraction engine developed by Backline IT.
Analyze the provided image of an invoice, receipt, or work order.
Extract all data into a strictly valid JSON object matching this structure:
{
  "vendor": {
    "name": "Vendor name or null",
    "taxNumber": "Tax / VAT ID or null",
    "address": "Address or null"
  },
  "customer": {
    "name": "Customer / Buyer name or null",
    "taxNumber": "Customer Tax ID or null"
  },
  "documentDetails": {
    "type": "Invoice" | "Receipt" | "Delivery Note" | "Work Order",
    "invoiceNumber": "Invoice / receipt number or null",
    "issueDate": "YYYY-MM-DD or raw date string or null",
    "dueDate": "YYYY-MM-DD or raw date string or null",
    "paymentMethod": "Cash / Card / Bank Transfer or null",
    "currency": "HUF" | "EUR" | "USD"
  },
  "items": [
    {
      "name": "Item description",
      "quantity": "Quantity e.g. 1 db, 25 liter",
      "unitPrice": "Unit price with currency",
      "vatRate": "VAT % e.g. 27%",
      "grossTotal": "Total amount for item"
    }
  ],
  "totals": {
    "netTotal": "Net amount or null",
    "vatTotal": "VAT amount or null",
    "grossTotal": "Final payable gross amount"
  },
  "confidenceScore": "98%"
}`
            : `Te a Backline IT által fejlesztett vállalati szintű számla-, nyugta- és dokumentum-feldolgozó OCR mesterséges intelligencia motor vagy.
Elemezd a csatolt számlát, bizonylatot vagy munkalapot.
Minden adatot strukturálj és adj vissza egy szigorúan érvényes JSON objektumban a következő formátumban:
{
  "vendor": {
    "name": "Kiállító / Szállító neve vagy null",
    "taxNumber": "Adószám vagy null",
    "address": "Cím vagy null"
  },
  "customer": {
    "name": "Vevő neve vagy null",
    "taxNumber": "Vevő adószáma vagy null"
  },
  "documentDetails": {
    "type": "Számla" | "Nyugta" | "Szállítólevél" | "Munkalap",
    "invoiceNumber": "Számlaszám vagy bizonylatazonosító",
    "issueDate": "Kelt / Kiállítás dátuma",
    "dueDate": "Fizetési határidő vagy null",
    "paymentMethod": "Készpénz / Bankkártya / Átutalás vagy null",
    "currency": "HUF" | "EUR" | "USD"
  },
  "items": [
    {
      "name": "Tétel megnevezése",
      "quantity": "Mennyiség pl. 1 db, 42.5 liter",
      "unitPrice": "Egységár pénznemmel",
      "vatRate": "ÁFA kulcs pl. 27%",
      "grossTotal": "Bruttó összeg"
    }
  ],
  "totals": {
    "netTotal": "Nettó végösszeg",
    "vatTotal": "ÁFA érték",
    "grossTotal": "Fizetendő bruttó végösszeg"
  },
  "confidenceScore": "98%"
}`;

        const targetUrl = `${endpoint.replace(/\/+$/, "")}/chat/completions`;

        const azureResponse = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                model: deployment,
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: isEn 
                                    ? "Extract all details from this invoice into the required JSON structure." 
                                    : "Nyerd ki az összes adatot a képen látható számlából a megadott JSON struktúrába."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image,
                                    detail: "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 800,
                response_format: { type: "json_object" }
            })
        });

        if (!azureResponse.ok) {
            const errorText = await azureResponse.text();
            console.error("Azure Vision Error:", errorText);
            return NextResponse.json(
                { error: "Hiba az Azure Vision feldolgozás során", details: errorText },
                { status: azureResponse.status }
            );
        }

        const data = await azureResponse.json();
        const rawContent = data.choices?.[0]?.message?.content || "{}";

        let parsedData = {};
        try {
            parsedData = JSON.parse(rawContent);
        } catch (e) {
            console.warn("JSON parse fallback error:", e);
        }

        return NextResponse.json({
            success: true,
            data: parsedData,
            usage: {
                totalTokens: data.usage?.total_tokens || 0,
                approxCostHuf: ((data.usage?.total_tokens || 0) * 0.0014).toFixed(2)
            }
        });

    } catch (error: any) {
        console.error("Vision API Error:", error);
        return NextResponse.json(
            { error: "Szerverhiba a számlafeldolgozás közben", message: error.message },
            { status: 500 }
        );
    }
}
