import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blogData = [
    {
        series: {
            title: "DevOps Mesterfogások",
            slug: "devops-mesterfogasok",
            description: "Tanuld meg, hogyan építhetsz stabil és skálázható infrastruktúrát modern eszközökkel.",
            coverImage: "/images/blog/devops-series.jpg" // Placeholder
        },
        posts: [
            {
                title: "Mi az a C/CD és miért elengedhetetlen?",
                slug: "mi-az-a-ci-cd",
                excerpt: "A folyamatos integráció és szállítás alapjai érthetően.",
                content: "A CI/CD (Continuous Integration / Continuous Delivery) a modern szoftverfejlesztés alapköve...",
                tags: ["DevOps", "CI/CD", "Automation"]
            },
            {
                title: "Docker konténerek biztonságos üzemeltetése",
                slug: "docker-biztonsag",
                excerpt: "Best practice tippek a konténerizált alkalmazások védelméhez.",
                content: "A Docker nagyszerű, de a biztonságra külön figyelni kell. Ebben a cikkben átvesszük...",
                tags: ["Docker", "Security", "DevOps"]
            },
            {
                title: "Kubernetes kezdőknek: Az első cluster",
                slug: "kubernetes-kezdoknek",
                excerpt: "Lépésről lépésre útmutató a Kubernetes világába.",
                content: "A Kubernetes (K8s) ijesztőnek tűnhet elsőre, de valójában logikus felépítésű...",
                tags: ["Kubernetes", "K8s", "Infrastructure"]
            }
        ]
    },
    {
        series: {
            title: "Modern Webfejlesztés",
            slug: "modern-webfejlesztes",
            description: "A legújabb technológiák és trendek a frontend és backend világából.",
            coverImage: "/images/blog/webdev-series.jpg"
        },
        posts: [
            {
                title: "Next.js 14: Server Actions vs API Routes",
                slug: "nextjs-server-actions",
                excerpt: "Mikor melyiket érdemes használni?",
                content: "A Next.js legújabb verziója bevezette a Server Action-öket, amik radikálisan...",
                tags: ["Next.js", "React", "Frontend"]
            },
            {
                title: "TailwindCSS trükkök profiknak",
                slug: "tailwindcss-trukkok",
                excerpt: "Hogyan írj tisztább és karbantarthatóbb CSS kódot.",
                content: "A TailwindCSS nagyon gyors, de könnyű elveszni az osztályok tengerében...",
                tags: ["CSS", "Tailwind", "Design"]
            },
            {
                title: "TypeScript tippek a hibamentes kódért",
                slug: "typescript-tippek",
                excerpt: "Így kerüld el az 'any' típus használatát.",
                content: "A TypeScript segít a hibák kiszűrésében, de csak ha jól használjuk...",
                tags: ["TypeScript", "JavaScript", "Coding"]
            }
        ]
    },
    {
        series: {
            title: "Automatizáció 101",
            slug: "automatizacio-101",
            description: "Hogyan spórolj időt és pénzt a folyamataid automatizálásával.",
            coverImage: "/images/blog/auto-series.jpg"
        },
        posts: [
            {
                title: "Bevezetés az n8n világába",
                slug: "n8n-bevezetes",
                excerpt: "Ingyenes és open-source workflow automatizálás.",
                content: "Az n8n egy node-alapú workflow editor, amivel szinte bármit összeköthetsz bármivel...",
                tags: ["n8n", "Automation", "Workflow"]
            },
            {
                title: "E-mailek automatikus rendszerezése",
                slug: "email-automatizacio",
                excerpt: "Soha többé ne veszíts el fontos levelet.",
                content: "Naponta órákat töltünk levelezéssel. Mutatunk egy scriptet, ami segít...",
                tags: ["Email", "Python", "Productivity"]
            },
            {
                title: "Web scraping Pythonnal: Etikusan és hatékonyan",
                slug: "python-web-scraping",
                excerpt: "Adatgyűjtés a webről automatizált eszközökkel.",
                content: "Az internet tele van adatokkal, de hogyan szerezzük meg őket strukturáltan?...",
                tags: ["Python", "Scraping", "Data"]
            }
        ]
    }
];

async function main() {
    for (const set of blogData) {
        const series = await prisma.blogSeries.upsert({
            where: { slug: set.series.slug },
            update: {},
            create: set.series
        });

        for (const post of set.posts) {
            await prisma.blogPost.upsert({
                where: { slug: post.slug },
                update: { seriesId: series.id, published: true },
                create: {
                    ...post,
                    seriesId: series.id,
                    published: true,
                    author: "BacklineIT Szakértő"
                }
            });
        }
    }
    console.log("Blog series seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
