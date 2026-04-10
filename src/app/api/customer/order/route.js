// /src/app/api/customer/order/route.js
import { prisma } from "@/app/lib/prisma";
import { verifyJWT } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/jwt=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyJWT(token);
    if (!decoded || decoded.role !== "customer")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cart } = await req.json();
    if (!cart || cart.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // Calculate total
    const totalAmount = cart.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );

    // Assume all items are from same hawker
    const hawkerId = cart[0].product.hawkerId;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: decoded.id,
        hawkerId,
        totalAmount,
        status: "PENDING", // Hawker confirmation pending
        products: {
          create: cart.map((item) => ({
            product: { connect: { id: item.product.id } },
            quantity: item.quantity,
          })),
        },
      },
      include: { products: { include: { product: true } } },
    });

    return NextResponse.json({ message: "Order created", order }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
