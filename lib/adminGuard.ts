import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function requireAdmin() {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== 'admin') {
        return {
            ok: false as const,
            response: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        };
    }

    return { ok: true as const, session };
}