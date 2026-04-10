// /src/app/api/hawker/order/confirm/route.js
import { prisma } from "@/app/lib/prisma";
import { verifyJWT } from "@/app/lib/auth";

export async function PATCH(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/jwt=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const decoded = verifyJWT(token);
    if (!decoded || decoded.role !== "hawker")
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const body = await req.json();
    const { orderId } = body;

    const updated = await prisma.order.updateMany({
      where: { id: orderId, hawkerId: decoded.id, status: "PENDING" },
      data: { status: "CONFIRMED" },
    });

    return new Response(JSON.stringify({ success: true, updated: updated.count }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
