import type { Problem } from "@/generated/prisma/client";
import {
  problemSchema,
  type ProblemFormValues,
} from "@/features/problems/schemas";

const difficultyLabels = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

export function toProblemFormValues(problem: Problem): ProblemFormValues {
  const parsed = problemSchema.safeParse({
    title: problem.title,
    description: problem.description,
    difficulty: difficultyLabels[problem.difficulty],
    tags: problem.tags,
    constraints: problem.constraints,
    hints: problem.hints ?? undefined,
    editorial: problem.editorial ?? undefined,
    testCases: problem.testCases,
    examples: problem.examples,
    codeSnippets: problem.codeSnippets,
    referenceSolutions: problem.referenceSolutions,
  });

  if (!parsed.success) {
    throw new Error("The stored problem cannot be loaded into the edit form.");
  }

  return parsed.data;
}
