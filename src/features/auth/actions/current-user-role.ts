"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function currentUserRole() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false as const, role: null };
    }

    const userRole = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    return { success: true as const, role: userRole?.role ?? null };
  } catch (error) {
    console.error("Error fetching user role:", error);
    return { success: false as const, role: null };
  }
}
