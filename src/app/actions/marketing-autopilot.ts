"use server"

import { auth } from "@/auth"
import { createBlogPost } from "@/app/actions/blog"
import { prisma } from "@/lib/db"

export interface MarketingCampaignResult {
    blog: {
        title: string
        slug: string
        excerpt: string
        content: string
        tags: string[]
        readingTime: string
        suggestedCoverUrl?: string
    }
    linkedin: {
        hook: string
        body: string
        bulletPoints: string[]
        callToAction: string
        hashtags: string[]
        fullText: string
    }
    visual: {
        conceptDescription: string
        dallePrompt: string
        bannerHeadline: string
        bannerSubline: string
        aspectRatio: string
    }
}

export interface GenerateCampaignParams {
    topic: string
    targetAudience?: string
    tone?: string
    customNotes?: string
}

export async function generateMarketingCampaign(params: GenerateCampaignParams): Promise<{
    success: boolean
    data?: MarketingCampaignResult
    error?: string
}> {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return {
                success: false,
                error: "Nem engedélyezett művelet: Csak adminisztrátorok generálhatnak AI marketing anyagokat."
            }
        }

        const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://hello-6780-resource.services.ai.azure.com/openai/v1"
        const apiKey = process.env.AZURE_OPENAI_KEY
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"

        if (!apiKey) {
            return {
                success: false,
                error: "Az Azure OpenAI API kulcs (AZURE_OPENAI_KEY) nincs beállítva a szerveren.",
            }
        }

        const apiUrl = rawEndpoint.endsWith("/v1")
            ? `${rawEndpoint}/chat/completions`
            : `${rawEndpoint}/openai/v1/chat/completions`

        const systemPrompt = `Te a BacklineIT vezető technológiai tartalomstratégája és B2B copywritere vagy.
A BacklineIT egy professzionális magyar informatikai szolgáltató és automatizációs partner.
Főbb területeink:
- IT Rendszergazda & Havidíjas üzemeltetés KKV-knak
- Kiberbiztonság, IT auditok és GDPR megfelelőség
- Felhőmigráció és infrastruktúra menedzsment (Microsoft Azure, AWS)
- Üzleti folyamatautomatizáció: egyedi Python scriptek, n8n munkafolyamatok, API integrációk
- Céges belső AI asszisztensek és intelligens tudásbázisok (RAG)
- Modern webfejlesztés (Next.js, modern UI/UX)

A feladatod: egyetlen koherens, azonnal publikálható marketing csomag generálása a megadott témában.
Kimeneti formátum: KIZÁRÓLAG egy érvényes JSON objektum, a következő struktúrával:

{
  "blog": {
    "title": "Figyelemfelkeltő, kattintásra és SEO-ra optimalizált magyar cím",
    "slug": "url-barat-slug-kisbetukkel-es-kotojelekkel",
    "excerpt": "Tömör, 2-3 mondatos összefoglaló / meta description, ami felkelti az érdeklődést",
    "tags": ["Címke1", "Címke2", "Címke3", "Címke4"],
    "readingTime": "5 perc olvasás",
    "suggestedCoverUrl": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    "content": "Teljes terjedelmű, mély szakmai blogcikk Markdown formátumban (## Címsorok, ### Alcímek, számozott pontok, vastagítások, gyakorlati magyar példák, és a végén egyértelmű CTA a BacklineIT ingyenes konzultációjára)."
  },
  "linkedin": {
    "hook": "Erős, stop-scroller nyitó mondat a hírfolyamban",
    "body": "A probléma és a megoldás lényege 2-3 bekezdésben",
    "bulletPoints": ["📌 Pont 1", "💡 Pont 2", "🚀 Pont 3"],
    "callToAction": "Konkrét felhívás cselekvésre vagy véleménykérő kérdés a kommentekbe",
    "hashtags": ["#BacklineIT", "#ITBiztonsag", "#KKV", "#Automatizacio"],
    "fullText": "A teljes LinkedIn poszt egyben, formázva emojikkal, bullet pontokkal és hashtagekkel, azonnal vágólapra másolható formában."
  },
  "visual": {
    "conceptDescription": "Magyar nyelvű magyarázat arról, hogy milyen illusztráció illik a cikkhez (színek: BacklineIT sötétkék és élénk cyan/neon akcentusok).",
    "dallePrompt": "Detailed English image generation prompt for DALL-E 3 or Midjourney (photorealistic or modern minimalist 3D tech illustration, cyan neon highlights, dark background, 16:9 aspect ratio, clean aesthetic).",
    "bannerHeadline": "Rövid, 2-4 szavas szöveg a képi bannerre",
    "bannerSubline": "Rövid kiegészítő alcím a bannerre",
    "aspectRatio": "16:9"
  }
}`

        const userMessage = `Kérlek, generáld le a teljes marketing csomagot a következő paraméterek alapján:
Téma: ${params.topic}
Célközönség: ${params.targetAudience || "Magyar KKV cégvezetők és IT döntéshozók"}
Hangnem: ${params.tone || "Szakmai, gyakorlatias, megbízható és megoldásközpontú"}
${params.customNotes ? `Egyedi megjegyzések / fókusz: ${params.customNotes}` : ""}

Fontos:
- A blogcikk legyen alapos, értékes és strukturált (legalább 400-600 szó Markdown formátumban).
- A LinkedIn poszt legyen figyelemfelkeltő és könnyen olvasható.
- A DALL-E prompt legyen professzionális angol prompt tech stílusban.`

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                model: deployment,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 3500,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("Azure OpenAI API Error:", response.status, errText)
            return {
                success: false,
                error: `Azure OpenAI hiba (${response.status}): ${errText.substring(0, 200)}`,
            }
        }

        const json = await response.json()
        const contentStr = json?.choices?.[0]?.message?.content

        if (!contentStr) {
            return {
                success: false,
                error: "Nem érkezett tartalom az Azure OpenAI modelltől.",
            }
        }

        const parsedResult = JSON.parse(contentStr) as MarketingCampaignResult

        // Record audit log
        try {
            if (session.user.id) {
                await prisma.auditLog.create({
                    data: {
                        action: "AI_MARKETING_GENERATION",
                        entity: "MarketingAutopilot",
                        details: JSON.stringify({
                            topic: params.topic,
                            blogTitle: parsedResult.blog?.title,
                        }),
                        userId: session.user.id,
                    },
                })
            }
        } catch (auditErr) {
            console.warn("Audit log creation skipped:", auditErr)
        }

        return {
            success: true,
            data: parsedResult,
        }
    } catch (err: any) {
        console.error("Marketing autopilot error:", err)
        return {
            success: false,
            error: err.message || "Ismeretlen hiba történt a generálás során.",
        }
    }
}

export async function saveGeneratedBlogPost(data: {
    title: string
    slug: string
    excerpt: string
    content: string
    tags: string[]
    coverImage?: string
    published?: boolean
}) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return {
                success: false,
                error: "Nem engedélyezett művelet: Csak adminisztrátor menthet blogcikket.",
            }
        }

        const res = await createBlogPost({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            tags: data.tags,
            coverImage: data.coverImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
            published: !!data.published,
            featured: false,
            author: "BacklineIT Team",
        })

        if (res.success && "slug" in res) {
            // Log creation in audit logs
            try {
                if (session.user.id) {
                    await prisma.auditLog.create({
                        data: {
                            action: data.published ? "AI_BLOG_PUBLISH" : "AI_BLOG_DRAFT_SAVE",
                            entity: "BlogPost",
                            entityId: res.slug,
                            details: JSON.stringify({
                                title: data.title,
                                slug: res.slug,
                                published: data.published,
                            }),
                            userId: session.user.id,
                        },
                    })
                }
            } catch (auditErr) {
                console.warn("Audit log creation skipped:", auditErr)
            }
        }

        return res
    } catch (err: any) {
        console.error("Save generated blog error:", err)
        return {
            success: false,
            error: err.message || "Nem sikerült elmenteni a bejegyzést.",
        }
    }
}
