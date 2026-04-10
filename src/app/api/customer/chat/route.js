// src/app/api/customer/chat/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) return NextResponse.json([], { status: 200 });

    // IDs are strings in MongoDB schema
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages || []);
  } catch (err) {
    console.error("GET /api/customer/chat error:", err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split("; ").find((c) => c.startsWith("auth_token="))?.split("=")[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { chatId, text } = body;

    if (!chatId || !text) {
      return NextResponse.json({ error: "chatId and text required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        chatId, // keep as string
        text,
        senderRole: decoded.role, // "customer" or "hawker"
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("POST /api/customer/chat error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}