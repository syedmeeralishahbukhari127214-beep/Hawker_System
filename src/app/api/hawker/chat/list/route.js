import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  try {
    // ✅ Token Read
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "hawker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find hawker using userId
    const hawker = await prisma.hawker.findUnique({
      where: { userId: decoded.id },
    });

    if (!hawker) {
      return NextResponse.json({ error: "Hawker not found" }, { status: 404 });
    }

    // ✅ Fetch Chats
    const chats = await prisma.chat.findMany({
      where: { hawkerId: hawker.id },

      include: {
        customer: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },

        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(chats || []);
  } catch (err) {
    console.error("Failed to load hawker chats:", err);
    return NextResponse.json(
      { error: "Failed to load chats" },
      { status: 500 }
    );
  }
}