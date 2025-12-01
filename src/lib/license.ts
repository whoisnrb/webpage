import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"

export async function generateLicenseKey(): Promise<string> {
    // Generate a random key in format XXXX-XXXX-XXXX-XXXX
    const bytes = randomBytes(8)
    const hex = bytes.toString('hex').toUpperCase()
    const parts = hex.match(/.{1,4}/g)
    return parts?.join('-') || ""
}

export async function createLicense(userId: string, type: string, orderId?: string) {
    const key = await generateLicenseKey()

    return prisma.license.create({
        data: {
            key,
            type,
            userId,
            orderId,
            status: 'ACTIVE'
        }
    })
}

export async function getLicensesByUser(userId: string) {
    return prisma.license.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getAllLicenses() {
    return prisma.license.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}
