import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ secure cookie storage

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Validate input
    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // 3️⃣ Check approval
    if (!user.isApproved) {
      return Response.json(
        { message: "Your account is pending admin approval" },
        { status: 403 }
      );
    }

    // 4️⃣ Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5️⃣ Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️⃣ Get cookies asynchronously
    const cookieStore = await cookies();

    // 7️⃣ Save JWT in secure HTTP-only cookie
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/",
    });

    // 8️⃣ Define redirect path
    let redirectPath = "/";
    if (user.role === "admin") redirectPath = "/admin/dashboard";
    else if (user.role === "hawker") redirectPath = "/hawker";
    else if (user.role === "customer") redirectPath = "/customer";

    return Response.json(
      {
        success: true,
        message: "Login successful",
        redirect: redirectPath,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
