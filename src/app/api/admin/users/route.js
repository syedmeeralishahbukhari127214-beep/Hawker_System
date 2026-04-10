import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        image: true,
        isApproved: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
