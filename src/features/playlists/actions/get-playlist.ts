"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function getPlaylist(id: string) {
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

    const playlist = await prisma.playlist.findFirst({
      where: { id, userId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        problemPlaylists: {
          orderBy: { createdAt: "asc" },
          select: {
            problem: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                tags: true,
              },
            },
          },
        },
      },
    });

    if (!playlist) {
      return { success: false as const, error: "Playlist not found" };
    }

    return { success: true as const, data: playlist };
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return { success: false as const, error: "Failed to fetch playlist" };
  }
}
