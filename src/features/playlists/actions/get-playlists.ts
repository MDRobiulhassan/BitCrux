"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function getPlaylists() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false as const, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!user) {
      return { success: false as const, error: "Unauthorized" };
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        problemPlaylists: {
          select: {
            problem: {
              select: { id: true, title: true, difficulty: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true as const, data: playlists };
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return { success: false as const, error: "Failed to fetch playlists" };
  }
}
