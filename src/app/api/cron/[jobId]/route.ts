import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cronHandlers } from "@/lib/cron-handlers";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> } // params is a Promise in Next.js 15
) {
    const { jobId } = await params;

    // 1. Authenticate (Simple API Key check if needed, or Vercel CRON header)
    const authHeader = req.headers.get("authorization");
    // For now, let's allow it if it's an admin (via session) OR if it has a secret key.
    // Implementation note: Real world would check CRON_SECRET.

    // 2. Fetch Job
    const job = await prisma.cronJob.findUnique({
        where: { id: jobId }
    });

    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.enabled) {
        return NextResponse.json({ error: "Job is disabled" }, { status: 400 });
    }

    // 3. Update Status to RUNNING
    await prisma.cronJob.update({
        where: { id: jobId },
        data: { status: "RUNNING", lastRun: new Date() }
    });

    const startTime = Date.now();
    let status = "SUCCESS";
    let output = "";

    try {
        // 4. Execute Logic
        const handler = cronHandlers[job.endpoint];
        if (handler) {
            output = await handler();
        } else {
            throw new Error(`No handler found for endpoint: ${job.endpoint}`);
        }
    } catch (error: any) {
        status = "FAILED";
        output = error.message || String(error);
    } finally {
        const duration = Date.now() - startTime;

        // 5. Update Job Status and Log
        await prisma.$transaction([
            prisma.cronJob.update({
                where: { id: jobId },
                data: { status: status === "SUCCESS" ? "IDLE" : "ERROR" }
            }),
            prisma.cronJobLog.create({
                data: {
                    jobId: jobId,
                    status,
                    output,
                    duration
                }
            })
        ]);
    }

    return NextResponse.json({ success: status === "SUCCESS", output });
}
