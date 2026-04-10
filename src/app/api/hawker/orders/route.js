// /src/app/api/hawker/orders/route.js
import { prisma } from "@/app/lib/prisma";
import { verifyJWT } from "@/app/lib/auth";

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/jwt=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const decoded = verifyJWT(token);
    if (!decoded || decoded.role !== "hawker")
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const orders = await prisma.order.findMany({
      where: { hawkerId: decoded.id },
      include: { products: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
