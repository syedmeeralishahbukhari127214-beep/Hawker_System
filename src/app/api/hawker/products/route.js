import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

// ==================== POST (ADD PRODUCT) ====================
export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "hawker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hawker = await prisma.hawker.findUnique({
      where: { userId: decoded.id },
    });

    if (!hawker) {
      return NextResponse.json({ error: "Hawker not found" }, { status: 404 });
    }

    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        hawkerId: hawker.id,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ==================== GET (FETCH PRODUCTS) ====================
export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "hawker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hawker = await prisma.hawker.findUnique({
      where: { userId: decoded.id },
    });

    if (!hawker) {
      return NextResponse.json({ error: "Hawker not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { hawkerId: hawker.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
