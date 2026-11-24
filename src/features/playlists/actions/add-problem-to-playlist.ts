"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import type { ServerResult } from "@/types";

const addProblemSchema = z.object({
  problemId: z.string().min(1),
  playlistId: z.string().min(1),
});

export async function addProblemToPlaylist(
  input: unknown,
): Promise<ServerResult<{ id: string }>> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "Unauthorized" };
    }

    const parsedInput = addProblemSchema.safeParse(input);

    if (!parsedInput.success) {
      return {
        success: false,
        error: parsedInput.error.issues[0]?.message ?? "Invalid request",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: parsedInput.data.playlistId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!playlist) {
      return { success: false, error: "Playlist not found" };
    }

    const problem = await prisma.problem.findUnique({
      where: { id: parsedInput.data.problemId },
      select: { id: true },
    });

    if (!problem) {
      return { success: false, error: "Problem not found" };
    }

    const relation = await prisma.problemPlaylist.create({
      data: {
        playlistId: playlist.id,
        problemId: problem.id,
      },
      select: { id: true },
    });

    return { success: true, data: relation };
  } catch (error) {
    console.error("Error adding problem to playlist:", error);
    return { success: false, error: "Failed to add problem to playlist" };
  }
}
