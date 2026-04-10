// /src/app/api/customer/payment/route.js
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

    const totalAmount = cart.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );

    // Mark order as PAID
    await prisma.order.updateMany({
      where: { customerId: decoded.id, status: "CONFIRMED" },
      data: { status: "PAID" },
    });

    // Clear cart
    await Promise.all(cart.map(item => prisma.cart.delete({ where: { id: item.id } })));

    return NextResponse.json({
      message: "Payment successful",
      transactionId: Math.floor(Math.random() * 1000000),
      amount: totalAmount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
