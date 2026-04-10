import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔓 JWT check hata diya hai, ab koi bhi fetch kar sakta hai
    const feedbacks = await prisma.feedback.findMany({
      include: {
        customer: {
          include: { 
            user: { select: { username: true, email: true } } 
          }
        },
        hawker: {
          include: { 
            user: { select: { username: true } } 
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    return NextResponse.json({ error: "Data fetch nahi ho saka" }, { status: 500 });
  }
}