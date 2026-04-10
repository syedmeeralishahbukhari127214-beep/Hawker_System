import { prisma } from "../../../lib/prisma";
import { verifyJWT } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    // ✅ Read token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find(c => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Verify JWT
    const user = verifyJWT(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // ✅ Fetch products of the hawker
    const products = await prisma.product.findMany({
      where: { hawkerId: params.hawkerId },
    });

    return NextResponse.json(products, { status: 200 });

  } catch (err) {
    console.error("Fetch hawker products error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}