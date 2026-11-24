"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/db";
import type { ServerResult } from "@/types";

export async function deleteProblem(
  id: string,
): Promise<ServerResult<{ id: string }>> {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return {
        success: false,
        error: access.status === 401 ? "Unauthenticated" : "Unauthorized",
      };
    }

    const problem = await prisma.problem.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!problem) {
      return { success: false, error: "Problem not found" };
    }

    await prisma.problem.delete({ where: { id: problem.id } });
    revalidatePath("/problems");
    revalidatePath(`/problems/${problem.slug}`);

    return { success: true, data: { id: problem.id } };
  } catch (error) {
    console.error(
      "Delete problem error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete problem",
    };
  }
}
