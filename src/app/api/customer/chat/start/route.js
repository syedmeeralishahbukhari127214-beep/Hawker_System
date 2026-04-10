import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hawkerId } = body;

    if (!hawkerId) {
      return NextResponse.json({ error: "hawkerId required" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: decoded.id },
    });

    if (!customer)
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const hawker = await prisma.hawker.findUnique({
      where: { id: hawkerId },
    });

    if (!hawker)
      return NextResponse.json({ error: "Hawker not found" }, { status: 404 });

    let chat = await prisma.chat.findFirst({
      where: {
        customerId: customer.id,
        hawkerId,
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          customerId: customer.id,
          hawkerId: hawker.id,
        },
      });
    }

    return NextResponse.json(chat);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to start chat" }, { status: 500 });
  }
}