export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { cloudinary } from '@/lib/cloudinary';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
};

async function uploadBufferToCloudinary(buffer: Buffer, folder: string) {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                overwrite: false,
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Upload Cloudinary fallito'));
                    return;
                }
                resolve(result as CloudinaryUploadResult);
            }
        );

        upload.end(buffer);
    });
}

export async function POST(req: NextRequest) {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary non configurato sul server.' }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'File mancante.' }, { status: 400 });
        }

        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            return NextResponse.json({ error: 'Formato non supportato. Usa JPG, PNG, WebP o AVIF.' }, { status: 400 });
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            return NextResponse.json({ error: 'Immagine troppo grande. Massimo 5MB.' }, { status: 400 });
        }

        const folder = process.env.CLOUDINARY_FOLDER?.trim() || 'products';
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await uploadBufferToCloudinary(buffer, folder);

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            format: result.format,
        });
    } catch (error) {
        console.error('Upload Cloudinary error:', error);
        return NextResponse.json({ error: 'Errore durante upload immagine.' }, { status: 500 });
    }
}
