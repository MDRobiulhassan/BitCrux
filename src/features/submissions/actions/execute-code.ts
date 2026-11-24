"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import {
  decodeJudge0Text,
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "@/server/services/judge0";
import { isProblemTestCaseArray } from "@/features/problems/types";

type TestCase = {
  input: string;
  output: string;
};

interface ExecutionTestCaseResult {
  testCase: number;
  passed: boolean;
  stdout: string | null;
  expected: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string | null;
  memory: string | null;
  time: string | null;
}

async function getExecutionContext(problemId: string) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { success: false as const, error: "Unauthorized" };
  }

  const [user, problem] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    }),
    prisma.problem.findUnique({
      where: { id: problemId },
      select: { testCases: true },
    }),
  ]);

  if (!user) {
    return { success: false as const, error: "Unauthorized" };
  }

  if (!problem) {
    return { success: false as const, error: "Problem not found" };
  }

  if (!isProblemTestCaseArray(problem.testCases) || !problem.testCases.length) {
    return { success: false as const, error: "Problem has invalid test cases" };
  }

  return {
    success: true as const,
    data: { userId: user.id, testCases: problem.testCases },
  };
}

async function runAgainstTestCases(
  sourceCode: string,
  languageId: number,
  testCases: TestCase[],
): Promise<ExecutionTestCaseResult[]> {
  const submissions = testCases.map((testCase) => ({
    source_code: sourceCode,
    language_id: languageId,
    stdin: testCase.input,
    expected_output: testCase.output,
    base64_encoded: false,
    wait: false,
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((response) => response.token);

  if (tokens.length !== testCases.length) {
    throw new Error("Compiler service returned an unexpected number of tokens.");
  }

  const results = await pollBatchResults(tokens);

  if (results.length !== testCases.length) {
    throw new Error("Compiler service returned an unexpected result count.");
  }

  return results.map((result, index) => {
    const stdout = decodeJudge0Text(result.stdout);
    const expected = testCases[index].output;

    return {
      testCase: index + 1,
      passed: (stdout?.trim() ?? "") === expected.trim(),
      stdout,
      expected,
      stderr: decodeJudge0Text(result.stderr),
      compileOutput: decodeJudge0Text(result.compile_output),
      status: result.status.description || null,
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    };
  });
}

function isSupportedLanguage(languageId: number) {
  return getLanguageName(languageId) !== "Unknown";
}

function logExecutionError(action: string, error: unknown) {
  console.error(
    `${action} error:`,
    error instanceof Error ? error.message : "Unknown error",
  );
}

export async function runCode(
  sourceCode: string,
  languageId: number,
  problemId: string,
) {
  try {
    if (!sourceCode.trim()) {
      return { success: false as const, error: "Please write some code first." };
    }

    if (!isSupportedLanguage(languageId)) {
      return { success: false as const, error: "Unsupported programming language." };
    }

    const context = await getExecutionContext(problemId);

    if (!context.success) {
      return context;
    }

    const testCaseResults = await runAgainstTestCases(
      sourceCode,
      languageId,
      context.data.testCases,
    );

    return {
      success: true as const,
      allPassed: testCaseResults.every((result) => result.passed),
      testCaseResults,
    };
  } catch (error) {
    logExecutionError("Code run", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Code run failed.",
    };
  }
}

export async function executeCode(
  sourceCode: string,
  languageId: number,
  problemId: string,
) {
  try {
    if (!sourceCode.trim()) {
      return { success: false as const, error: "Please write some code first." };
    }

    if (!isSupportedLanguage(languageId)) {
      return { success: false as const, error: "Unsupported programming language." };
    }

    const context = await getExecutionContext(problemId);

    if (!context.success) {
      return context;
    }

    const testCaseResults = await runAgainstTestCases(
      sourceCode,
      languageId,
      context.data.testCases,
    );
    const allPassed = testCaseResults.every((result) => result.passed);

    const submission = await prisma.$transaction(async (tx) => {
      const createdSubmission = await tx.submission.create({
        data: {
          userId: context.data.userId,
          problemId,
          sourceCode,
          language: getLanguageName(languageId),
          stdin: context.data.testCases.map((testCase) => testCase.input).join("\n"),
          stdout: JSON.stringify(
            testCaseResults.map((result) => result.stdout),
          ),
          stderr: testCaseResults.some((result) => result.stderr)
            ? JSON.stringify(testCaseResults.map((result) => result.stderr))
            : null,
          compileOutput: testCaseResults.some((result) => result.compileOutput)
            ? JSON.stringify(
                testCaseResults.map((result) => result.compileOutput),
              )
            : null,
          status: allPassed ? "Accepted" : "Wrong Answer",
          memory: JSON.stringify(testCaseResults.map((result) => result.memory)),
          time: JSON.stringify(testCaseResults.map((result) => result.time)),
          testCaseResults: {
            create: testCaseResults,
          },
        },
        include: {
          testCaseResults: true,
        },
      });

      if (allPassed) {
        await tx.problemSolved.upsert({
          where: {
            userId_problemId: {
              userId: context.data.userId,
              problemId,
            },
          },
          update: {},
          create: {
            userId: context.data.userId,
            problemId,
          },
        });
      }

      return createdSubmission;
    });

    return {
      success: true as const,
      allPassed,
      submission,
      testCaseResults,
    };
  } catch (error) {
    logExecutionError("Code submission", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Code execution failed.",
    };
  }
}
