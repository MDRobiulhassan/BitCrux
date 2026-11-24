"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function getCurrentUserData() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No Authenticated User found" };
    }

    return await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        submissions: true,
        solvedProblems: true,
        playlists: true,
      },
    });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return { success: false, error: "Failed to fetch authenticated user" };
  }
}
