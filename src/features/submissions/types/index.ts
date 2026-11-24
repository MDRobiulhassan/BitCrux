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

export interface CodeExecutionResponse {
  success: boolean;
  allPassed?: boolean;
  submission?: Submission;
  testCaseResults?: ExecutionTestCaseResult[];
  error?: string;
}
