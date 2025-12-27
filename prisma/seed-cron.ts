import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const jobs = [
        {
            name: "Session Cleanup",
            description: "Removes expired sessions from the database.",
            schedule: "0 0 * * *", // Daily at midnight
            endpoint: "cleanup-sessions",
        },
        {
            name: "Weekly Newsletter",
            description: "Sends the weekly newsletter to subscribed users.",
            schedule: "0 9 * * 1", // Mondays at 9 AM
            endpoint: "send-newsletter",
        },
        {
            name: "License Check",
            description: "Verifies validity of active licenses.",
            schedule: "0 */6 * * *", // Every 6 hours
            endpoint: "check-licenses",
        },
    ];

    for (const job of jobs) {
        await prisma.cronJob.upsert({
            where: { name: job.name },
            update: {},
            create: job,
        });
    }

    console.log("Cron jobs seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
