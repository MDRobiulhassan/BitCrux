import "server-only";

import { cache } from "react";
import { prisma } from "@/server/db";
import type { Problem } from "@/generated/prisma/client";
import type { ServerResult } from "@/types";
import type { PublicProblem } from "@/features/problems/types";
import { requireAdmin } from "@/server/auth/require-admin";

export const getProblemById = cache(
  async (id: string): Promise<ServerResult<PublicProblem | null>> => {
    try {
      const problem =
        (await prisma.problem.findUnique({
          where: { slug: id },
          omit: { referenceSolutions: true },
        })) ??
        (await prisma.problem.findUnique({
          where: { id },
          omit: { referenceSolutions: true },
        }));

      return { success: true as const, data: problem };
    } catch (error) {
      console.error("Error fetching problem:", error);
      return { success: false as const, error: "Failed to fetch problem" };
    }
  },
);

export async function getProblemForAdmin(
  id: string,
): Promise<ServerResult<Problem | null>> {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return {
        success: false,
        error: access.status === 401 ? "Unauthenticated" : "Unauthorized",
      };
    }

    const problem =
      (await prisma.problem.findUnique({ where: { slug: id } })) ??
      (await prisma.problem.findUnique({ where: { id } }));

    return { success: true as const, data: problem };
  } catch (error) {
    console.error("Error fetching problem for admin:", error);
    return { success: false as const, error: "Failed to fetch problem" };
  }
}
