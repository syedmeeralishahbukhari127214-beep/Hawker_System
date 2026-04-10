"use server";

import jwt from "jsonwebtoken";
import prisma from "../../src/helpers/db";
import { cookies } from "next/headers";

export async function getUserFromSession() {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return null;
    }
    const tokenData = jwt.decode(token);
    if (!tokenData) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { email: tokenData.email },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}
