import type { Problem } from "@/generated/prisma/client";

export type ProblemLanguage = "CPP" | "PYTHON" | "JAVA";

export type ProblemListItem = Pick<
  Problem,
  "id" | "slug" | "title" | "tags" | "difficulty"
> & {
  isSolved: boolean;
};

interface ProblemTestCase {
  input: string;
  output: string;
}

export function isProblemTestCaseArray(
  value: unknown,
): value is ProblemTestCase[] {
  return (
    Array.isArray(value) &&
    value.every(
      (testCase): testCase is ProblemTestCase =>
        typeof testCase === "object" &&
        testCase !== null &&
        !Array.isArray(testCase) &&
        "input" in testCase &&
        typeof testCase.input === "string" &&
        "output" in testCase &&
        typeof testCase.output === "string",
    )
  );
}
