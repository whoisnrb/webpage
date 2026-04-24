import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
    const siteUrl = "https://backlineit.hu"

    let posts: any[] = []
    try {
        posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
                title: true,
                slug: true,
                excerpt: true,
                author: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    } catch (error) {
        console.error("RSS feed: error fetching posts", error)
    }

    const feedItems = posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.author || "BacklineIT Team"}</author>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.tags.map((tag: string) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
        )
        .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>BacklineIT Blog</title>
    <link>${siteUrl}/blog</link>
    <description>IT megoldások, webfejlesztés, automatizáció és kiberbiztonság – a BacklineIT csapat szakmai blogja.</description>
    <language>hu</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>BacklineIT Blog</title>
      <link>${siteUrl}</link>
    </image>
    ${feedItems}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}
