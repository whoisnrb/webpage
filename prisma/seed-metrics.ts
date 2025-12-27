import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const metrics = [
        {
            key: "projects_completed",
            value: 120,
            label: "Sikeres Projekt",
            icon: "CheckCircle",
        },
        {
            key: "hours_saved",
            value: 5000,
            label: "Megtakarított Óra",
            icon: "Clock",
        },
        {
            key: "active_users",
            value: 450,
            label: "Aktív Felhasználó",
            icon: "Users",
        },
        {
            key: "uptime",
            value: 99,
            label: "Rendelkezésre Állás %",
            icon: "Server",
        },
    ];

    for (const metric of metrics) {
        await prisma.metric.upsert({
            where: { key: metric.key },
            update: {},
            create: metric,
        });
    }

    console.log("Metrics seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
