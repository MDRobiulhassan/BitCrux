"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import type { ProblemListItem } from "@/features/problems/types";

export async function getAllProblems() {
  try {
    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch (error) {
      console.error("Unable to load optional problem-list user:", error);
    }

    const [rows, user] = await Promise.all([
      prisma.problem.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          tags: true,
          difficulty: true,
          solvedBy: {
            where: clerkUser
              ? { user: { is: { clerkId: clerkUser.id } } }
              : { userId: "" },
            select: { problemId: true },
          },
          problemPlaylists: {
            where: clerkUser
              ? {
                  playlist: {
                    is: { user: { is: { clerkId: clerkUser.id } } },
                  },
                }
              : { playlistId: "" },
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      clerkUser
        ? prisma.user
            .findUnique({
              where: { clerkId: clerkUser.id },
              select: { role: true },
            })
            .catch((error) => {
              console.error("Unable to load optional problem-list role:", error);
              return null;
            })
        : Promise.resolve(null),
    ]);

    const problems: ProblemListItem[] = rows.map(
      ({ solvedBy, problemPlaylists, ...problem }) => ({
        ...problem,
        isSolved: solvedBy.length > 0,
        isSaved: problemPlaylists.length > 0,
      }),
    );

    return {
      success: true as const,
      data: { problems, user: user ? { role: user.role } : null },
    };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { success: false as const, error: "Failed to fetch problems" };
  }
}
