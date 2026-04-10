import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

// =======================
// GET Messages
// =======================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json([], { status: 200 });
    }

    // ✅ Customer jaisa simple string chatId
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages || []);
  } catch (err) {
    console.error("Hawker GET messages error:", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}

// =======================
// POST Send Message
// =======================
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

    const body = await req.json();
    const { chatId, text } = body;

    if (!chatId || !text) {
      return NextResponse.json(
        { error: "chatId and text required" },
        { status: 400 }
      );
    }

    // ✅ Save message same like customer
    const message = await prisma.message.create({
      data: {
        chatId,
        text,
        senderRole: "hawker",
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("Hawker POST message error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}