import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function requireAdmin() {
    const token = (await cookies()).get('auth-token')?.value;

    if (!token) {
        return {
            ok: false as const,
            response: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        };
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );
        const verified = await jwtVerify(token, secret);
        const role = verified.payload.role;

        if (role !== 'admin') {
            return {
                ok: false as const,
                response: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
            };
        }

        return { ok: true as const, session: verified.payload };
    } catch {
        return {
            ok: false as const,
            response: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        };
    }
}
