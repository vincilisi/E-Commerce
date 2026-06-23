<<<<<<< HEAD
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

=======
>>>>>>> master
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // RESET COMPLETO E CORRETTO DEL DATABASE

    // 1️⃣ Cancella PRIMA tutte le relazioni
    await prisma.productImage.deleteMany();
    await prisma.productMaterial.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.review.deleteMany();

    // 2️⃣ Poi cancella i prodotti
    await prisma.product.deleteMany();

    // 3️⃣ Poi cancella utenti e settings
    await prisma.user.deleteMany();
    await prisma.siteSettings.deleteMany();

<<<<<<< HEAD
    // 4️⃣ Ricrea admin
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

    // 5️⃣ Ricrea settings
    await prisma.siteSettings.create({
      data: {
        id: '1',
        primaryColor: '#9333ea',
        secondaryColor: '#6366f1',
        accentColor: '#fde047',
        siteName: 'Il Desiderio di una Stella'
      }
    });

    // 6️⃣ Ricrea prodotti iniziali
    const productsData = [
      {
        id: '1',
        name: 'Portachiavi Stella Dorata',
        description: 'Elegante portachiavi fatto a mano con stella dorata e perline cristallo',
        price: 12.99,
        category: 'Classici',
        inStock: true,
        dimensions: '8cm x 3cm',
        images: ['/products/stella-dorata.jpg']
      },
      {
        id: '2',
        name: 'Portachiavi Luna Argentata',
        description: 'Portachiavi artigianale con ciondolo luna e charm stelline',
        price: 10.99,
        category: 'Classici',
        inStock: true,
        dimensions: '7cm x 3cm',
        images: ['/products/luna-argentata.jpg']
      },
      {
        id: '3',
        name: 'Portachiavi Costellazione',
        description: 'Design unico con perline che formano una costellazione personalizzabile',
        price: 15.99,
        category: 'Personalizzati',
        inStock: true,
        dimensions: '10cm x 4cm',
        images: ['/products/costellazione.jpg']
      },
      {
        id: '4',
        name: 'Portachiavi Stelle Colorate',
        description: 'Set di mini stelle colorate con dettagli brillanti',
        price: 9.99,
        category: 'Colorati',
        inStock: true,
        dimensions: '6cm x 2.5cm',
        images: ['/products/stelle-colorate.jpg']
      }
    ];

    for (const product of productsData) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          inStock: product.inStock,
          dimensions: product.dimensions,
          images: {
            create: product.images.map((url) => ({ url }))
          }
=======
        for (const product of productsData) {
<<<<<<< HEAD
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
=======
            await prisma.product.upsert({
                where: { id: product.id },
                update: {},
                create: product
>>>>>>> master
            });
>>>>>>> main
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
