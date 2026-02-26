export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        // Crea utente admin
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@stella.it' },
            update: {},
            create: {
                email: 'admin@stella.it',
                name: 'Amministratore',
                password: hashedPassword,
                role: 'admin'
            }
        });

        // Crea settings iniziali
        await prisma.siteSettings.upsert({
            where: { id: '1' },
            update: {},
            create: {
                id: '1',
                primaryColor: '#9333ea',
                secondaryColor: '#6366f1',
                accentColor: '#fde047',
                siteName: 'Il Desiderio di una Stella'
            }
        });

        // Crea prodotti iniziali nel database
        const productsData = [
            {
                id: '1',
                name: 'Portachiavi Stella Dorata',
                description: 'Elegante portachiavi fatto a mano con stella dorata e perline cristallo',
                price: 12.99,
                images: JSON.stringify(['/products/stella-dorata.jpg']),
                category: 'Classici',
                inStock: true,
                materials: JSON.stringify(['Metallo dorato', 'Perline cristallo', 'Catena']),
                dimensions: '8cm x 3cm'
            },
            {
                id: '2',
                name: 'Portachiavi Luna Argentata',
                description: 'Portachiavi artigianale con ciondolo luna e charm stelline',
                price: 10.99,
                images: JSON.stringify(['/products/luna-argentata.jpg']),
                category: 'Classici',
                inStock: true,
                materials: JSON.stringify(['Metallo argentato', 'Charm decorativi']),
                dimensions: '7cm x 3cm'
            },
            {
                id: '3',
                name: 'Portachiavi Costellazione',
                description: 'Design unico con perline che formano una costellazione personalizzabile',
                price: 15.99,
                images: JSON.stringify(['/products/costellazione.jpg']),
                category: 'Personalizzati',
                inStock: true,
                materials: JSON.stringify(['Perline vetro', 'Filo metallico', 'Moschettone']),
                dimensions: '10cm x 4cm'
            },
            {
                id: '4',
                name: 'Portachiavi Stelle Colorate',
                description: 'Set di mini stelle colorate con dettagli brillanti',
                price: 9.99,
                images: JSON.stringify(['/products/stelle-colorate.jpg']),
                category: 'Colorati',
                inStock: true,
                materials: JSON.stringify(['Resina colorata', 'Glitter', 'Anello portachiavi']),
                dimensions: '6cm x 2.5cm'
            }
        ];

        for (const product of productsData) {
            const images = JSON.parse(product.images || '[]');
            const materials = JSON.parse(product.materials || '[]');

            await prisma.product.upsert({
                where: { id: product.id },
                update: {},
                create: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    inStock: product.inStock,
                    dimensions: product.dimensions,
                    images: {
                        create: images.map((url: string) => ({ url }))
                    },
                    materials: {
                        create: materials.map((name: string) => ({ name }))
                    }
                }
            });
        }

        return NextResponse.json({
            message: 'Database inizializzato con successo',
            admin: admin.email
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
