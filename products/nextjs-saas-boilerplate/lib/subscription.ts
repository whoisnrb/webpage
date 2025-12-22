import { prisma } from "@/lib/db"

export async function checkSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
        where: { userId },
    })

    if (!subscription) return false

    const isPro =
        subscription.status === "ACTIVE" &&
        subscription.stripeCurrentPeriodEnd &&
        subscription.stripeCurrentPeriodEnd.getTime() > Date.now()

    return isPro
}

export async function getUserSubscription(userId: string) {
    return await prisma.subscription.findUnique({
        where: { userId },
    })
}
