"use server";

import "server-only";

import { prisma } from "@/server/db";
import type { Problem } from "@/generated/prisma/client";
import type { ServerResult } from "@/types";

export async function getProblemById(
  id: string,
): Promise<ServerResult<Problem | null>> {
  try {
    const problem = await prisma.problem.findUnique({ where: { id } });
    return { success: true as const, data: problem };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { success: false as const, error: "Failed to fetch problem" };
  }
}
