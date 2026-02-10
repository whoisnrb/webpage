'use server'

import { prisma } from "@/lib/db"

export interface RecentPurchase {
    name: string
    product: string
    time: string
}

export async function getRecentPurchases(): Promise<RecentPurchase[]> {
    try {
        const items = await prisma.consultation.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                product: true
            }
        })

        const now = new Date()

        return items.map(item => {
            const name = item.name
            const product = item.product?.name || item.packageName || 'Konzultáció'

            const diffInSeconds = Math.floor((now.getTime() - new Date(item.createdAt).getTime()) / 1000)
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
        console.error('Error fetching recent activities:', error)
        return []
    }
}
