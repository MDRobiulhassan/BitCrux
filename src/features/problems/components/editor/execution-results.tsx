"use client";

import { SubmissionDetails } from "@/features/submissions";
import { TestCaseTable } from "@/features/problems/components/editor/testcase-table";
import type { Submission } from "@/generated/prisma/client";

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

interface ExecutionResultsProps {
  executionResponse: {
    submission?: Submission;
    testCaseResults?: ExecutionTestCaseResult[];
  } | null;
}

export function ExecutionResults({ executionResponse }: ExecutionResultsProps) {
  if (!executionResponse?.submission) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <SubmissionDetails submission={executionResponse.submission} />
      <TestCaseTable testCases={executionResponse.testCaseResults ?? []} />
    </div>
  );
}
