import { NextRequest, NextResponse } from 'next/server';

// Placeholder per NextAuth - per ora disabilitato
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'Auth endpoint' });
}

export async function POST(req: NextRequest) {
    return NextResponse.json({ message: 'Auth endpoint' });
}
