
"use server"

import { prisma as db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type BlogPostData = {
    title: string
    slug: string
    excerpt: string
    content: string
    author?: string
    tags: string[]
    published: boolean
    featured: boolean
    coverImage?: string
}

export async function createBlogPost(data: BlogPostData) {
    try {
        await db.blogPost.create({
            data: {
                ...data,
                author: data.author || "BacklineIT Team",
            }
        })
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true }
    } catch (error) {
        console.error("Error creating blog post:", error)
        return { success: false, error: "Failed to create blog post" }
    }
}

export async function updateBlogPost(id: string, data: BlogPostData) {
    try {
        await db.blogPost.update({
            where: { id },
            data
        })
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        revalidatePath(`/blog/${data.slug}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating blog post:", error)
        return { success: false, error: "Failed to update blog post" }
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await db.blogPost.delete({
            where: { id }
        })
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete blog post" }
    }
}

export async function getBlogPostById(id: string) {
    try {
        const post = await db.blogPost.findUnique({
            where: { id }
        })
        return post
    } catch (error) {
        return null
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await db.blogPost.findUnique({
            where: { slug }
        })
        return post
    } catch (error) {
        return null
    }
}

export async function getBlogPosts() {
    try {
        const posts = await db.blogPost.findMany({
            orderBy: { createdAt: "desc" }
        })
        return posts
    } catch (error) {
        return []
    }
}

export async function generateDemoContent() {
    // Check if we already have content to avoid duplicates
    const count = await db.blogPost.count();
    if (count > 0) return { success: false, error: "Content already exists" }

    const demoPosts = [
        {
            title: "Hogyan automatizáljuk az ügyfélszolgálatot?",
            slug: "ugyfelszolgalat-automatizalas-2025",
            excerpt: "Ismerd meg a legújabb AI és chatbot technológiákat, amelyekkel 24/7 támogatást nyújthatsz az ügyfeleidnek.",
            content: `
# Hogyan automatizáljuk az ügyfélszolgálatot?

Az ügyfélszolgálat az egyik legkritikusabb terület minden vállalkozás életében. A vásárlók gyors, pontos és segítőkész válaszokat várnak, lehetőleg azonnal. De hogyan lehet ezt biztosítani anélkül, hogy hatalmas support csapatot tartanánk fenn? A válasz: **automatizáció**.

## Miért fontos az automatizáció?

1. **24/7 Elérhetőség:** A botok nem alszanak.
2. **Költséghatékonyság:** Kevesebb emberi erőforrás szükséges a rutin kérések kezeléséhez.
3. **Gyorsaság:** Azonnali válaszok a gyakori kérdésekre.

## Eszközök és Megoldások

A modern AI chatbotok, mint például a ChatGPT alapú megoldások, képesek megérteni a kontextust és természetes nyelven válaszolni.

### Implementációs Lépések

1. **Gyakori kérdések összegyűjtése:** Milyen kérdésekkel fordulnak hozzánk a legtöbbször?
2. **Platform kiválasztása:** Intercom, Zendesk, vagy egyedi fejlesztés?
3. **Tanítás és Tesztelés:** Az AI finomhangolása a cég specifikus tudásbázisával.

Ha segítségre van szükséged az implementációban, a BacklineIT csapata készen áll a segítségre!
            `,
            tags: ["Automatizálás", "AI", "Ügyfélszolgálat"],
            published: true,
            featured: true,
            author: "Török Norbert"
        },
        {
            title: "Webshop sebesség optimalizálás: 5 tipp a konverzió növeléséhez",
            slug: "webshop-sebesseg-optimalizalas",
            excerpt: "A lassú weboldal vevőket veszít. Mutatjuk, hogyan gyorsítsd fel a webshopodat és növeld a bevételedet.",
            content: `
# Webshop sebesség optimalizálás: 5 tipp a konverzió növeléséhez

Tudtad, hogy minden másodperc késleltetés az oldalbetöltésben 7%-kal csökkentheti a konverziót? Egy lassú webshop nem csak idegesítő, de pénzbe is kerül.

## 5 Gyakorlati Tipp

1. **Képoptimalizálás:** Használj WebP formátumot és megfelelő tömörítést.
2. **Cache használata:** Használj böngésző és szerver oldali gyorsítótárazást (pl. Redis, Cloudflare).
3. **Kód minimalizálás:** Töröld a felesleges CSS és JavaScript kódokat.
4. **CDN (Content Delivery Network):** Szolgáld ki a tartalmat a felhasználóhoz legközelebbi szerverről.
5. **Adatbázis optimalizálás:** Indexelj megfelelően és töröld a régi adatokat.

## Esettanulmány: Hogyan gyorsítottunk fel egy Magento webshopot 300%-kal?

Egyik ügyfelünk, egy nagy forgalmú divat webshop, lassú betöltéssel küzdött. A fenti lépések implementálásával a betöltési időt 4,5 másodpercről 1,2 másodpercre csökkentettük, ami **25%-os árbevétel növekedést** eredményezett.
            `,
            tags: ["Webfejlesztés", "E-commerce", "Optimalizálás"],
            published: true,
            featured: false,
            author: "BacklineIT Team"
        },
        {
            title: "A BacklineIT története: Hogyan segítettünk 50+ vállalkozásnak?",
            slug: "backlineit-tortenet-sikersztorik",
            excerpt: "Egy kis garázscégből indultunk, mára pedig az egyik legmegbízhatóbb IT partner lettünk. Olvasd el a történetünket.",
            content: `
# A BacklineIT története

Minden nagy utazás egy kis lépéssel kezdődik. A mi utazásunk azzal a felismeréssel indult, hogy a KKV szektornak hatalmas szüksége van professzionális, mégis elérhető árú IT megoldásokra.

## A Kezdetek

Kezdetben csak egyszerű weboldalakat készítettünk. Azonban hamar rájöttünk, hogy ügyfeleinknek nem csak egy "kirakatüvegre" van szükségük, hanem olyan rendszerekre, amelyek valódi üzleti értéket teremtenek.

## A Fordulópont: Automatizáció

Amikor elkezdtünk egyedi scripteket és automatizációs megoldásokat kínálni, láttuk, mekkora terhet tudunk levenni a vállalkozók válláról. 

> "A BacklineIT segítségével heti 15 órát spóroltam meg az adminisztráción. Ez idő alatt végre az üzletfejlesztéssel tudtam foglalkozni." - Kovács Péter, Ügyvezető

## A Jövő

Célunk, hogy a legmodernebb technológiákat (AI, Machine Learning) is elérhetővé tegyük minden partnerünk számára.
            `,
            tags: ["Case Study", "Rólunk", "Siker"],
            published: true,
            featured: true,
            author: "Török Norbert"
        }
    ]

    for (const post of demoPosts) {
        await db.blogPost.create({ data: post })
    }

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { success: true }
}
