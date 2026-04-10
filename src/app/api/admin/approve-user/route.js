import { prisma } from "../../../lib/prisma";

export async function PATCH(req) {
  try {
    const { id, type, action } = await req.json();

    if (!id || !type || !action) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update user approval status
    const updated = await prisma.user.update({
      where: { id },
      data: { isApproved: action === "approve" },
    });

    return Response.json({ success: true, user: updated });
  } catch (err) {
    console.error("Error approving user:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
