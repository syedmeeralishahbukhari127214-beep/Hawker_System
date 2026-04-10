import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const hawkers = await prisma.hawker.findMany({
      include: {
        user: {
          select: { username: true },
        },
      },
    });
    return NextResponse.json(hawkers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load hawkers" }, { status: 500 });
  }
}
