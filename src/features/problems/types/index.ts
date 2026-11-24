export type ProblemLanguage = "CPP" | "PYTHON" | "JAVA";

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
