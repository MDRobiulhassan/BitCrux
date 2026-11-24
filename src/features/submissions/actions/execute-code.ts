"use server";

import "server-only";

import { prisma } from "@/server/db";
import {
  decodeJudge0Text,
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "@/server/services/judge0";
import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";

export async function executeCode(
  source_code: string,
  language_id: number,
  stdin: string[],
  expected_output: string[],
  id: string,
) {
  try {
    const user = await getCurrentUserData();

    if (!user || !("id" in user)) {
      return {
        success: false,
        error: "Unauthorized",
      }
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return {
        success: false,
        error: "Invalid Test Cases",
      };
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((response: { token: string }) => response.token);

    const results = await pollBatchResults(tokens);

    const detailedResults = results.map((result, index) => {
      const stdout = decodeJudge0Text(result.stdout);
      const expectedOutput = expected_output[index];

      const actualOutput = stdout?.trim() ?? null;
      const passed = actualOutput === expectedOutput.trim();

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expectedOutput,
        stderr: decodeJudge0Text(result.stderr),
        compileOutput: decodeJudge0Text(result.compile_output),
        status: result.status.description || null,
        memory: result.memory ? `${result.memory} KB` : null,
        time: result.time ? `${result.time} s` : null,
      };
    });

    if (results.length !== expected_output.length) {
      throw new Error("Unexpected number of test case results.");
    }

    const allPassed = detailedResults.every((result) => result.passed);

    const submission = await prisma.$transaction(async (tx) => {
      const createdSubmission = await tx.submission.create({
        data: {
          userId: user.id,
          problemId: id,
          sourceCode: source_code,
          language: getLanguageName(language_id),
          stdin: stdin.join("\n"),
          stdout: JSON.stringify(
            detailedResults.map((result) => result.stdout),
          ),
          stderr: detailedResults.some((r) => r.stderr)
            ? JSON.stringify(detailedResults.map((r) => r.stderr))
            : null,
          compileOutput: detailedResults.some((r) => r.compileOutput)
            ? JSON.stringify(detailedResults.map((r) => r.compileOutput))
            : null,
          status: allPassed ? "Accepted" : "Wrong Answer",
          memory: JSON.stringify(detailedResults.map((r) => r.memory)),
          time: JSON.stringify(detailedResults.map((r) => r.time)),
          testCaseResults: {
            create: detailedResults,
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
              userId: user.id,
              problemId: id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            problemId: id,
          },
        });
      }

      return createdSubmission;
    });

    return {
      success: true,
      allPassed,
      submission,
      testCaseResults: detailedResults,
    };
  } catch (error) {
    console.error("Code execution error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Code execution failed.",
    };
  }
};
