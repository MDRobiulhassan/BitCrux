import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { Difficulty, UserRole } from "@/generated/prisma/client";
import {
  getJudge0languageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const user = await getCurrentUserData();

    if (!user || !("id" in user)) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 },
      );
    }

    // 2. Authorization
    const userRole = await currentUserRole();

    if (!userRole.success || userRole.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 3. Parse request body once
    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    // 4. Validate required fields
    if (
      !title ||
      !description ||
      !difficulty ||
      !constraints ||
      !Array.isArray(tags) ||
      !Array.isArray(testCases) ||
      !Array.isArray(examples) ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    if (!Object.values(Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty" },
        { status: 400 },
      );
    }

    if (testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 },
      );
    }

    // 5. Validate test cases
    const invalidTestCase = testCases.some(
      (testCase: any) =>
        typeof testCase.input !== "string" ||
        typeof testCase.output !== "string",
    );

    if (invalidTestCase) {
      return NextResponse.json(
        { error: "Invalid test case format" },
        { status: 400 },
      );
    }

    // 6. Validate reference solutions
    const languages = Object.entries(referenceSolutions);

    if (languages.length === 0) {
      return NextResponse.json(
        { error: "At least one reference solution is required" },
        { status: 400 },
      );
    }

    for (const [language, solutionCode] of languages) {
      const languageId = getJudge0languageId(language);

      if (!languageId) {
        return NextResponse.json(
          { error: `Unsupported language: ${language}` },
          { status: 400 },
        );
      }

      if (typeof solutionCode !== "string" || !solutionCode.trim()) {
        return NextResponse.json(
          { error: `Invalid reference solution for ${language}` },
          { status: 400 },
        );
      }

      // 7. Prepare Judge0 submissions
      const submissions = testCases.map(
        (testCase: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.output,
        }),
      );

      // 8. Submit batch
      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map(
        (result: { token: string }) => result.token,
      );

      if (tokens.length !== testCases.length) {
        return NextResponse.json(
          { error: `Judge0 submission failed for ${language}` },
          { status: 502 },
        );
      }

      // 9. Poll results
      const results = await pollBatchResults(tokens);

      // 10. Validate execution results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i].stdin,
                expectedOutput: submissions[i].expected_output,
                actualOutput: result.stdout,
                error: result.stderr || result.compile_output || result.message,
              },
              status: result.status,
            },
            { status: 400 },
          );
        }
      }
    }

    // 11. Create problem after ALL languages pass
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints: hints || null,
        editorial: editorial || null,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create problem error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
