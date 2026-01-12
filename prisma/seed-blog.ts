import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blogData = [
    {
        series: {
            title: "DevOps Mesterfogások",
            titleEn: "DevOps Mastery",
            slug: "devops-mesterfogasok",
            description: "Tanuld meg, hogyan építhetsz stabil és skálázható infrastruktúrát modern eszközökkel.",
            descriptionEn: "Learn how to build stable and scalable infrastructure with modern tools.",
            coverImage: "/images/blog/devops-series.jpg"
        },
        posts: [
            {
                title: "Mi az a CI/CD és miért elengedhetetlen?",
                titleEn: "What is CI/CD and why is it essential?",
                slug: "mi-az-a-ci-cd",
                excerpt: "A folyamatos integráció és szállítás alapjai érthetően.",
                excerptEn: "The basics of continuous integration and delivery explained clearly.",
                content: "A CI/CD (Continuous Integration / Continuous Delivery) a modern szoftverfejlesztés alapköve. Segítségével a kód automatikusan tesztelődik és kerül élesítésre, csökkentve a hibák kockázatát és növelve a fejlesztési sebességet.",
                contentEn: "CI/CD (Continuous Integration / Continuous Delivery) is the cornerstone of modern software development. It allows code to be automatically tested and deployed, reducing the risk of errors and increasing development speed.",
                tags: ["DevOps", "CI/CD", "Automation"]
            },
            {
                title: "Docker konténerek biztonságos üzemeltetése",
                titleEn: "Secure Operation of Docker Containers",
                slug: "docker-biztonsag",
                excerpt: "Best practice tippek a konténerizált alkalmazások védelméhez.",
                excerptEn: "Best practice tips for protecting containerized applications.",
                content: "A Docker nagyszerű, de a biztonságra külön figyelni kell. Ebben a cikkben átvesszük a legfontosabb hardening lépéseket, a user namespace mapping-től a hálózati izolációig.",
                contentEn: "Docker is great, but security needs special attention. In this article, we'll cover the most important hardening steps, from user namespace mapping to network isolation.",
                tags: ["Docker", "Security", "DevOps"]
            }
        ]
    },
    {
        series: {
            title: "Modern Webfejlesztés",
            titleEn: "Modern Web Development",
            slug: "modern-webfejlesztes",
            description: "A legújabb technológiák és trendek a frontend és backend világából.",
            descriptionEn: "The latest technologies and trends from the frontend and backend world.",
            coverImage: "/images/blog/webdev-series.jpg"
        },
        posts: [
            {
                title: "Next.js 14: Server Actions vs API Routes",
                titleEn: "Next.js 14: Server Actions vs API Routes",
                slug: "nextjs-server-actions",
                excerpt: "Mikor melyiket érdemes használni?",
                excerptEn: "When is it worth using which one?",
                content: "A Next.js legújabb verziója bevezette a Server Action-öket, amik radikálisan egyszerűsítik az adatok kezelését. De vajon kiváltják az API route-okat? Megvizsgáljuk a pro és kontra érveket.",
                contentEn: "The latest version of Next.js introduced Server Actions, which radically simplify data handling. But will they replace API routes? We'll examine the pros and cons.",
                tags: ["Next.js", "React", "Frontend"]
            }
        ]
    },
    {
        series: {
            title: "Üzleti Automatizáció",
            titleEn: "Business Automation",
            slug: "automatizacio-101",
            description: "Hogyan spórolj időt és pénzt a folyamataid automatizálásával.",
            descriptionEn: "How to save time and money by automating your processes.",
            coverImage: "/images/blog/auto-series.jpg"
        },
        posts: [
            {
                title: "Bevezetés az n8n világába",
                titleEn: "Introduction to the World of n8n",
                slug: "n8n-bevezetes",
                excerpt: "Ingyenes és open-source workflow automatizálás.",
                excerptEn: "Free and open-source workflow automation.",
                content: "Az n8n egy node-alapú workflow editor, amivel szinte bármit összeköthetsz bármivel. Legyen szó CRM szinkronizációról vagy automatikus számlázásról, az n8n a tökéletes eszköz.",
                contentEn: "n8n is a node-based workflow editor that allows you to connect almost anything with anything. Whether it's CRM synchronization or automatic invoicing, n8n is the perfect tool.",
                tags: ["n8n", "Automation", "Workflow"]
            }
        ]
    }
];

async function main() {
    console.log("Start seeding blog content...");
    for (const set of blogData) {
        const series = await prisma.blogSeries.upsert({
            where: { slug: set.series.slug },
            update: {
                title: set.series.title,
                titleEn: set.series.titleEn,
                description: set.series.description,
                descriptionEn: set.series.descriptionEn,
                coverImage: set.series.coverImage,
            },
            create: set.series
        });

        for (const post of set.posts) {
            await prisma.blogPost.upsert({
                where: { slug: post.slug },
                update: {
                    title: post.title,
                    titleEn: post.titleEn,
                    excerpt: post.excerpt,
                    excerptEn: post.excerptEn,
                    content: post.content,
                    contentEn: post.contentEn,
                    seriesId: series.id,
                    published: true
                },
                create: {
                    ...post,
                    seriesId: series.id,
                    published: true,
                    author: "BacklineIT Expert"
                }
            });
        }
    }
    console.log("Blog series and posts seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
