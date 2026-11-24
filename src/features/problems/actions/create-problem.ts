"use server";

import "server-only";

import { getJudge0LanguageId } from "@/features/problems/constants/languages";
import { problemSchema } from "@/features/problems/schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/db";
import { Difficulty } from "@/generated/prisma/client";
import {
  CompilerServiceUnavailableError,
  pollBatchResults,
  submitBatch,
} from "@/server/services/judge0";
import { createProblemSlug } from "@/features/problems/utils/problem-slug";

type CreateProblemResult =
  | { success: true; data: { id: string }; warning?: string }
  | { success: false; error: string };

const difficultyMap = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
} as const;

export async function createProblem(
  input: unknown,
): Promise<CreateProblemResult> {
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

    const values = parsedInput.data;
    const testCases = values.testCases;
    const languages = Object.entries(values.referenceSolutions);
    let validationWarning: string | undefined;

    for (const [language, solutionCode] of languages) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return { success: false, error: `Unsupported language: ${language}` };
      }

      if (!solutionCode.trim()) {
        return {
          success: false,
          error: `Invalid reference solution for ${language}`,
        };
      }

      const submissions = testCases.map((testCase) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      try {
        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((result) => result.token);

        if (tokens.length !== testCases.length) {
          return {
            success: false,
            error: `Compiler service submission failed for ${language}`,
          };
        }

        const results = await pollBatchResults(tokens);

        if (results.length !== testCases.length) {
          throw new Error(`Unexpected result count for ${language}.`);
        }

        const failedResult = results.find((result) => result.status.id !== 3);

        if (failedResult) {
          return {
            success: false,
            error: `Reference solution validation failed for ${language}: ${
              failedResult.stderr ||
              failedResult.compile_output ||
              failedResult.message ||
              failedResult.status.description
            }`,
          };
        }
      } catch (error) {
        if (!(error instanceof CompilerServiceUnavailableError)) {
          throw error;
        }

        validationWarning = `${error.message} The problem will be saved, but one or more reference solutions were not verified.`;
        console.warn("Saving problem without complete solution validation.");
        break;
      }
    }

    const baseSlug = createProblemSlug(values.title);
    const existingSlugs = await prisma.problem.findMany({
      where: {
        OR: [
          { slug: baseSlug },
          { slug: { startsWith: `${baseSlug}-` } },
        ],
      },
      select: { slug: true },
    });
    const usedSlugs = new Set(existingSlugs.map(({ slug }) => slug));
    let slug = baseSlug;
    let suffix = 2;

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    let problem: { id: string } | undefined;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        problem = await prisma.problem.create({
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
            testCases: JSON.parse(JSON.stringify(testCases)),
            codeSnippets: JSON.parse(JSON.stringify(values.codeSnippets)),
            referenceSolutions: JSON.parse(
              JSON.stringify(values.referenceSolutions),
            ),
            userId: access.user.id,
          },
          select: { id: true },
        });
        break;
      } catch (error) {
        if (
          typeof error !== "object" ||
          error === null ||
          !("code" in error) ||
          error.code !== "P2002"
        ) {
          throw error;
        }

        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
    }

    if (!problem) {
      throw new Error("Unable to generate a unique problem URL.");
    }

    return {
      success: true,
      data: problem,
      ...(validationWarning ? { warning: validationWarning } : {}),
    };
  } catch (error) {
    console.error(
      "Create problem error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create problem",
    };
  }
}
