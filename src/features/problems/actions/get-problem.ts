import "server-only";

import { cache } from "react";
import { prisma } from "@/server/db";
import type { Problem } from "@/generated/prisma/client";
import type { ServerResult } from "@/types";

export const getProblemById = cache(
  async (id: string): Promise<ServerResult<Problem | null>> => {
    try {
      const problem =
        (await prisma.problem.findUnique({ where: { slug: id } })) ??
        (await prisma.problem.findUnique({ where: { id } }));

      return { success: true as const, data: problem };
    } catch (error) {
      console.error("Error fetching problem:", error);
      return { success: false as const, error: "Failed to fetch problem" };
    }
  },
);
