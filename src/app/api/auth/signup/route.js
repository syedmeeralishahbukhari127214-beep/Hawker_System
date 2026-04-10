import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, email, password, role, phone, address } = await req.json();

    // 1️⃣ Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create base user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        isApproved: false, // pending admin approval
      },
    });

    // 4️⃣ Create role-specific record
    if (role === "hawker") {
      await prisma.hawker.create({
        data: {
          userId: user.id,
          isApproved: false,
        },
      });
    } else if (role === "customer") {
      await prisma.customer.create({
        data: {
          userId: user.id,
          isApproved: false,
        },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Registration successful. Await admin approval.",
        user,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
