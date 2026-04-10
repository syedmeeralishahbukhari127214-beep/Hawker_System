// /src/app/api/admin/products/route.js
import { prisma } from "../../../lib/prisma"; // ⚠️ named import
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        hawker: {
          include: {
            user: { select: { username: true } },
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
