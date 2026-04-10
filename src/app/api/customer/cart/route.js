import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";
import { NextResponse } from "next/server";

// 🔐 Helper: Get user from cookie
function getUserFromRequest(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find(c => c.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) return null;
  return verifyJWT(token);
}

/* ===========================
   GET - Fetch Cart
=========================== */
export async function GET(req) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findMany({
      where: { customerId: user.id },
      include: { product: true },
    });

    return NextResponse.json(cart);
  } catch (err) {
    console.error("Fetch cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===========================
   POST - Add To Cart
=========================== */
export async function POST(req) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    // Check if product already in cart
    const existing = await prisma.cart.findFirst({
      where: {
        customerId: user.id,
        productId,
      },
    });

    if (existing) {
      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 },
      });
    } else {
      await prisma.cart.create({
        data: {
          customerId: user.id,
          productId,
          quantity: 1,
        },
      });
    }

    const updatedCart = await prisma.cart.findMany({
      where: { customerId: user.id },
      include: { product: true },
    });

    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===========================
   PUT - Update Quantity
=========================== */
export async function PUT(req) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (quantity < 1) {
      await prisma.cart.deleteMany({
        where: {
          customerId: user.id,
          productId,
        },
      });
    } else {
      await prisma.cart.updateMany({
        where: {
          customerId: user.id,
          productId,
        },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findMany({
      where: { customerId: user.id },
      include: { product: true },
    });

    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("Update cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===========================
   DELETE - Remove Item
=========================== */
export async function DELETE(req) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    await prisma.cart.deleteMany({
      where: {
        customerId: user.id,
        productId,
      },
    });

    const updatedCart = await prisma.cart.findMany({
      where: { customerId: user.id },
      include: { product: true },
    });

    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("Delete cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
