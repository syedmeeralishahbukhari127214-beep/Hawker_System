import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // 1️⃣ Cookie se token nikalna
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please login first" }, { status: 401 });
    }

    // 2️⃣ Token decode karke user data nikalna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { rating, comment, hawkerId } = await req.json();

    // 3️⃣ Database mein check karna ke ye user Customer hai ya nahi
    const customer = await prisma.customer.findUnique({
      where: { userId: userId }
    });

    if (!customer) {
      return NextResponse.json({ error: "Only customers can give feedback" }, { status: 403 });
    }

    // 4️⃣ Feedback create karna
    const feedback = await prisma.feedback.create({
      data: {
        rating: parseInt(rating),
        comment: comment || "",
        customerId: customer.id,
        hawkerId: hawkerId,
      },
    });

    return NextResponse.json({ success: true, feedback }, { status: 201 });

  } catch (err) {
    console.error("Feedback Auth Error:", err);
    return NextResponse.json({ error: "Session expired or invalid token" }, { status: 401 });
  }
}