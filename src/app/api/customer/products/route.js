import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // 1️⃣ Fetch products with hawker + username + image
    const products = await prisma.product.findMany({
      include: {
        hawker: {
          include: {
            user: { select: { username: true, image: true } }, // ✅ removed updatedAt
          },
        },
      },
    });

    // 2️⃣ Filter only products with valid hawker
    const validProducts = products.filter((p) => p.hawker?.id);

    // 3️⃣ Get all unique hawker IDs
    const hawkerIds = [...new Set(validProducts.map((p) => p.hawker.id))];

    // 4️⃣ Aggregate feedback per hawker
    const feedbackStats = await prisma.feedback.groupBy({
      by: ["hawkerId"],
      where: { hawkerId: { in: hawkerIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // 5️⃣ Convert feedback stats to map
    const statsMap = {};
    feedbackStats.forEach((stat) => {
      statsMap[stat.hawkerId] = {
        avgRating: Number((stat._avg.rating || 0).toFixed(1)),
        reviewCount: stat._count.rating || 0,
      };
    });

    // 6️⃣ Merge feedback stats + image into hawker
    const updatedProducts = validProducts.map((product) => {
      const hawker = product.hawker;
      const hawkerStats = statsMap[hawker.id] || { avgRating: 0, reviewCount: 0 };

      return {
        ...product,
        hawker: {
          id: hawker.id,
          username: hawker.user.username,
          image: hawker.user.image || null, // just use image URL
          ...hawkerStats,
        },
      };
    });

    return new Response(JSON.stringify(updatedProducts), { status: 200 });
  } catch (err) {
    console.error("Available Hawker Fetch Error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}
