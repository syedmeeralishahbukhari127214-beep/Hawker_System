import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

/* ================================
   ✅ Helper to save image locally
================================ */
async function saveImage(file) {
  const uploadsDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`; // URL to save in DB
}

/* ================================
   ✅ GET Hawker Profile
================================ */
export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "hawker")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Use string id directly
    const hawker = await prisma.hawker.findUnique({
      where: { userId: decoded.id },
      include: { user: true },
    });

    if (!hawker)
      return NextResponse.json({ error: "Hawker not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        id: hawker.user.id,
        username: hawker.user.username,
        email: hawker.user.email,
        phone: hawker.user.phone,
        address: hawker.user.address,
        // cache-buster for image
        image: hawker.user.image
          ? `${hawker.user.image}?v=${hawker.user.updatedAt?.getTime() || Date.now()}`
          : null,
      },
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/* ================================
   ✅ UPDATE Hawker Profile
================================ */
export async function PUT(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "hawker")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();

    const username = formData.get("username");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const image = formData.get("image"); // File | null

    if (!username || !email)
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 });

    let imageUrl = null;
    if (image && typeof image === "object") {
      imageUrl = await saveImage(image); // Save locally
      console.log("Image saved:", imageUrl);
    }

    // ✅ Update user safely, string id used directly
    // ✅ SAHI CODE
const updatedUser = await prisma.user.update({
  where: { id: decoded.id },
  data: {
    username: username,
    email: email,
    phone: phone,
    address: address,
    ...(imageUrl ? { image: imageUrl } : {}),
  },
});
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        image: updatedUser.image
          ? `${updatedUser.image}?v=${Date.now()}` // cache-buster
          : null,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}