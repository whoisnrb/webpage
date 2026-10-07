import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NewsletterManager } from "@/components/admin/newsletter/newsletter-manager";

export const metadata = {
    title: "Hírlevél Kezelő | BacklineIT Admin",
};

export default async function AdminNewsletterPage() {
    const session = await auth();

    const [subscribers, campaigns] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma.newsletterCampaign.findMany({
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return (
        <NewsletterManager
            initialSubscribers={subscribers as any}
            initialCampaigns={campaigns as any}
            userEmail={session?.user?.email || "whoisnrb@gmail.com"}
        />
    );
}
