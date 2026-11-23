import { handlers } from "@/auth"
import { NextRequest } from "next/server"

function fixRequest(req: NextRequest): NextRequest {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host && (host.includes("backlineit.com") || host.includes("backlineit.hu"))) {
        const origin = `${proto}://${host}`;
        const newUrl = req.nextUrl.href.replace(req.nextUrl.origin, origin);
        return new NextRequest(newUrl, req);
    }
    return req;
}

function fixResponse(response: Response, req: NextRequest): Response {
    const location = response.headers.get("location");
    if (location && (location.includes("0.0.0.0:3000") || location.includes("localhost:3000") || location.includes(":3000"))) {
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "backlineit.hu";
        const proto = req.headers.get("x-forwarded-proto") || "https";
        const correctOrigin = `${proto}://${host}`;
        const fixedLocation = location.replace(/https?:\/\/[^\/]+:3000/, correctOrigin);
        const newHeaders = new Headers(response.headers);
        newHeaders.set("location", fixedLocation);
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }
    return response;
}

export const GET = async (req: NextRequest) => {
    const fixedReq = fixRequest(req);
    const res = await handlers.GET(fixedReq);
    return fixResponse(res, req);
};

export const POST = async (req: NextRequest) => {
    const fixedReq = fixRequest(req);
    const res = await handlers.POST(fixedReq);
    return fixResponse(res, req);
};
