import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

export async function GET() {
    try {
        const metrics = await prisma.metric.findMany({
            where: { active: true },
            select: {
                key: true,
                value: true,
                label: true,
                icon: true
            }
        });

        // Translate labels if needed, or just return as is.
        // Ideally, labels in DB are translation keys (e.g., "metrics.projects")
        // For now, we return raw data.

        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Failed to fetch metrics:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}
