"use client";

import { SubmissionDetails } from "@/features/submissions";
import { TestCaseTable } from "@/features/problems/components/editor/testcase-table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CodeExecutionResponse } from "@/features/submissions/types";

interface ExecutionResultsProps {
  executionResponse: CodeExecutionResponse | null;
}

export function ExecutionResults({ executionResponse }: ExecutionResultsProps) {
  if (!executionResponse?.testCaseResults?.length) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      {executionResponse.submission ? (
        <SubmissionDetails submission={executionResponse.submission} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Run Results</CardTitle>
            <CardDescription>
              {executionResponse.allPassed
                ? "All test cases passed."
                : "Some test cases failed."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      <TestCaseTable testCases={executionResponse.testCaseResults} />
    </div>
  );
}
