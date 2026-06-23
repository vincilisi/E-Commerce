import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "ID mancante" },
        { status: 400 }
      );
    }

    await prisma.productImage.deleteMany({
      where: { productId }
    });

    await prisma.productMaterial.deleteMany({
      where: { productId }
    });

    await prisma.productTag.deleteMany({
      where: { productId }
    });

    await prisma.review.deleteMany({
      where: { productId }
    });

    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Errore durante l'eliminazione" },
      { status: 500 }
    );
  }
}