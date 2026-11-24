"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import type { ServerResult } from "@/types";

const createPlaylistSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  description: z.string().trim().max(500).optional(),
});

export async function createPlaylist(
  input: unknown,
): Promise<ServerResult<{ id: string }>> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "Unauthorized" };
    }

    const parsedInput = createPlaylistSchema.safeParse(input);

    if (!parsedInput.success) {
      return {
        success: false,
        error: parsedInput.error.issues[0]?.message ?? "Invalid playlist data",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const playlist = await prisma.playlist.create({
      data: {
        name: parsedInput.data.name,
        description: parsedInput.data.description ?? null,
        userId: user.id,
      },
      select: { id: true },
    });

    return { success: true, data: playlist };
  } catch (error) {
    console.error("Error creating playlist:", error);
    return { success: false, error: "Failed to create playlist" };
  }
}
