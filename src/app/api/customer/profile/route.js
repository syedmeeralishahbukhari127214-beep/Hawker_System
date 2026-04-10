// app/api/customer/profile/route.js
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
   ✅ GET Customer Profile
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
    if (!decoded || decoded.role !== "customer")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await prisma.customer.findUnique({
      where: { userId: decoded.id },
      include: { user: true },
    });

    if (!customer)
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        id: customer.user.id,
        username: customer.user.username,
        email: customer.user.email,
        phone: customer.user.phone,
        address: customer.user.address,
        image: customer.user.image
          ? `${customer.user.image}?v=${customer.user.updatedAt?.getTime() || Date.now()}`
          : null,
      },
    });
  } catch (error) {
    console.error("Customer Profile Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/* ================================
   ✅ UPDATE Customer Profile
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
    if (!decoded || decoded.role !== "customer")
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
      imageUrl = await saveImage(image);
      console.log("Image saved:", imageUrl);
    }

    // ✅ Update user safely
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        username,
        email,
        phone,
        address,
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
          ? `${updatedUser.image}?v=${Date.now()}`
          : null,
      },
    });
  } catch (error) {
    console.error("Customer Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}