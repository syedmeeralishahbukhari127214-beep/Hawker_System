import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const hawkers = await prisma.hawker.findMany({
      include: {
        user: true, // username, email, etc
      },
    });

    return NextResponse.json(hawkers);
  } catch (error) {
    console.error("Error fetching hawkers:", error);
    return NextResponse.json(
      { message: "Failed to fetch hawkers" },
      { status: 500 }
    );
  }
}