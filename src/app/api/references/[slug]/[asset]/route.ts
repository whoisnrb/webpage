import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; asset: string }> }
) {
    const { slug, asset } = await params

    try {
        const ref = await (prisma as any).reference.findUnique({
            where: { slug },
            select: { image: true, clientLogo: true, galleryImages: true, updatedAt: true }
        })

        if (!ref) {
            return new NextResponse("Reference not found", { status: 404 })
        }

        let rawSource: string | null = null

        if (asset === "image") {
            rawSource = ref.image
        } else if (asset === "logo") {
            rawSource = ref.clientLogo
        } else if (asset.startsWith("gallery-")) {
            const index = parseInt(asset.replace("gallery-", ""), 10)
            if (!isNaN(index) && ref.galleryImages && ref.galleryImages[index]) {
                rawSource = ref.galleryImages[index]
            }
        }

        if (!rawSource) {
            return new NextResponse("Asset not found", { status: 404 })
        }

        // If it's already an external URL
        if (rawSource.startsWith("http://") || rawSource.startsWith("https://")) {
            return NextResponse.redirect(rawSource, { status: 307 })
        }

        // If it's already a relative static path (e.g. /images/references/patient-system.png)
        if (rawSource.startsWith("/") && !rawSource.startsWith("/api/")) {
            try {
                const fs = await import("fs/promises")
                const path = await import("path")
                const cleanRelPath = rawSource.replace(/^\/+/, "")
                const filePath = path.join(process.cwd(), "public", cleanRelPath)
                const fileBytes = await fs.readFile(filePath)
                const ext = path.extname(filePath).toLowerCase()
                const mimeMap: Record<string, string> = {
                    ".png": "image/png",
                    ".jpg": "image/jpeg",
                    ".jpeg": "image/jpeg",
                    ".webp": "image/webp",
                    ".svg": "image/svg+xml",
                    ".ico": "image/x-icon",
                }
                const mimeType = mimeMap[ext] || "application/octet-stream"

                const etag = `"${slug}-${asset}-${ref.updatedAt ? new Date(ref.updatedAt).getTime() : 1}"`
                const ifNoneMatch = request.headers.get("if-none-match")
                if (ifNoneMatch === etag) {
                    return new NextResponse(null, { status: 304 })
                }

                return new NextResponse(fileBytes, {
                    status: 200,
                    headers: {
                        "Content-Type": mimeType,
                        "Content-Length": fileBytes.length.toString(),
                        "Cache-Control": "public, max-age=31536000, stale-while-revalidate=86400",
                        "ETag": etag,
                    }
                })
            } catch (fsErr) {
                console.warn(`Could not read static file directly for ${rawSource}, redirecting to public URL:`, fsErr)
                const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host")
                const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
                const baseUrl = (forwardedHost && !forwardedHost.includes("0.0.0.0") && !forwardedHost.includes("127.0.0.1") && !forwardedHost.includes("localhost"))
                    ? `${forwardedProto}://${forwardedHost}`
                    : (process.env.NEXT_PUBLIC_APP_URL || "https://backlineit.hu")
                return NextResponse.redirect(new URL(rawSource, baseUrl), { status: 307 })
            }
        }

        // If it's a data URI: data:[mime];base64,[data]
        const match = rawSource.match(/^data:([^;]+);base64,(.+)$/)
        if (!match) {
            return new NextResponse("Invalid image format", { status: 400 })
        }

        const mimeType = match[1]
        const base64Data = match[2]
        
        // Decode base64 using standard Web APIs without triggering node:buffer chunk
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        const etag = `"${slug}-${asset}-${ref.updatedAt ? new Date(ref.updatedAt).getTime() : 1}"`

        // HTTP 304 Not Modified support
        const ifNoneMatch = request.headers.get("if-none-match")
        if (ifNoneMatch === etag) {
            return new NextResponse(null, { status: 304 })
        }

        return new NextResponse(bytes, {
            status: 200,
            headers: {
                "Content-Type": mimeType,
                "Content-Length": bytes.length.toString(),
                "Cache-Control": "public, max-age=31536000, stale-while-revalidate=86400",
                "ETag": etag,
            }
        })
    } catch (error) {
        console.error("Error serving reference image:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
