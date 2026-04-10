import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const totalHawkers = await prisma.user.count({ where: { role: "hawker" } });
    const totalCustomers = await prisma.user.count({ where: { role: "customer" } });
    const totalProducts = await prisma.product.count();

    const pendingHawkers = await prisma.user.findMany({
      where: { role: "hawker", isApproved: false },
      select: { id: true, username: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const pendingCustomers = await prisma.user.findMany({
      where: { role: "customer", isApproved: false },
      select: { id: true, username: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      totalHawkers,
      totalCustomers,
      totalProducts,
      pendingApprovals: pendingHawkers.length + pendingCustomers.length,
      pendingHawkers,
      pendingCustomers,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return Response.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
