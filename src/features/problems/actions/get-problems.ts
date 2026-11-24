"use server";

import "server-only";

import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { prisma } from "@/server/db";

export async function getAllProblems() {
  try {
    const user = await getCurrentUserData();

    if (!user || !("id" in user)) {
      return { success: false as const, error: "Unauthorized" };
    }

    const problems = await prisma.problem.findMany({
      include: { solvedBy: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true as const, data: problems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { success: false as const, error: "Failed to fetch problems" };
  }
}
