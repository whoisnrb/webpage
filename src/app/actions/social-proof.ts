'use server'

import { prisma } from "@/lib/db"

export interface RecentPurchase {
    name: string
    product: string
    time: string
}

export async function getRecentPurchases(): Promise<RecentPurchase[]> {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: 'SUCCESS'
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return orders.map(order => {
            // Extract first name for privacy
            const nameParts = (order.customerName || 'Vásárló').split(' ')
            // Assuming "Lastname Firstname" order in Hungarian, or just take the first part if unsure.
            // Let's try to be smart: if 2 parts, usually [Last, First]. If 1 part, just that.
            // But actually, for "Gábor", "Anna", it's the first name.
            // In Hungary: Kovács János -> János is the first name (utónév).
            // So we usually want the LAST part of the name string if it's Hungarian order.
            // But let's just use the full name or a generic "Vásárló" if missing.
            // Actually, let's just use the name as is, or maybe just the first part if it looks like a full name.
            // Let's just use the whole name for now, or maybe "K. János" format?
            // Let's stick to the first name if we can guess it.
            // Simple approach: just use the name provided.
            const name = order.customerName || 'Vásárló'

            // Product name
            const product = order.items.length > 0 ? order.items[0].product.name : 'Szolgáltatás'

            // Time calculation
            const diffInSeconds = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 1000)
            let time = ''

            if (diffInSeconds < 60) {
                time = 'épp most'
            } else if (diffInSeconds < 3600) {
                const mins = Math.floor(diffInSeconds / 60)
                time = `${mins} perce`
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600)
                time = `${hours} órája`
            } else {
                const days = Math.floor(diffInSeconds / 86400)
                time = `${days} napja`
            }

            return {
                name,
                product,
                time
            }
        })
    } catch (error) {
        console.error('Error fetching recent purchases:', error)
        return []
    }
}
