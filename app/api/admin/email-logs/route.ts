import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lista log email inviate
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');

        const logs = await prisma.emailLog.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        // Statistiche
        const stats = await prisma.emailLog.groupBy({
            by: ['status'],
            _count: true
        });

        const totalSent = stats.find(s => s.status === 'sent')?._count || 0;
        const totalFailed = stats.find(s => s.status === 'failed')?._count || 0;

        return NextResponse.json({
            logs,
            stats: {
                total: totalSent + totalFailed,
                sent: totalSent,
                failed: totalFailed
            }
        });
    } catch (error) {
        console.error('Error fetching email logs:', error);
        return NextResponse.json({ error: 'Errore nel recupero dei log' }, { status: 500 });
    }
}
