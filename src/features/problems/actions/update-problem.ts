"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { Difficulty } from "@/generated/prisma/client";
import { problemSchema } from "@/features/problems/schemas";
import { createProblemSlug } from "@/features/problems/utils/problem-slug";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/db";
import type { ServerResult } from "@/types";

const difficultyMap = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
} as const;

export async function updateProblem(
  id: string,
  input: unknown,
): Promise<ServerResult<{ id: string; slug: string }>> {
  try {
    const access = await requireAdmin();

    if (!access.authorized) {
      return {
        success: false,
        error: access.status === 401 ? "Unauthenticated" : "Unauthorized",
      };
    }

    const parsedInput = problemSchema.safeParse(input);

    if (!parsedInput.success) {
      return {
        success: false,
        error: parsedInput.error.issues[0]?.message ?? "Invalid problem data",
      };
    }

    const existing = await prisma.problem.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: "Problem not found" };
    }

    const values = parsedInput.data;
    let slug = existing.slug;

    if (values.title !== existing.title) {
      const baseSlug = createProblemSlug(values.title);
      const existingSlugs = await prisma.problem.findMany({
        where: {
          id: { not: id },
          OR: [
            { slug: baseSlug },
            { slug: { startsWith: `${baseSlug}-` } },
          ],
        },
        select: { slug: true },
      });
      const usedSlugs = new Set(existingSlugs.map((problem) => problem.slug));
      slug = baseSlug;

      for (let suffix = 2; usedSlugs.has(slug); suffix += 1) {
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        slug,
        title: values.title,
        description: values.description,
        difficulty: difficultyMap[values.difficulty],
        tags: values.tags,
        examples: JSON.parse(JSON.stringify(values.examples)),
        constraints: values.constraints,
        hints: values.hints || null,
        editorial: values.editorial || null,
        testCases: JSON.parse(JSON.stringify(values.testCases)),
        codeSnippets: JSON.parse(JSON.stringify(values.codeSnippets)),
        referenceSolutions: JSON.parse(
          JSON.stringify(values.referenceSolutions),
        ),
      },
      select: { id: true, slug: true },
    });

    revalidatePath("/problems");
    revalidatePath(`/problems/${existing.slug}`);
    revalidatePath(`/problems/${updated.slug}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error(
      "Update problem error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update problem",
    };
  }
}
