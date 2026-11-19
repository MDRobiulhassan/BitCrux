"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { executeCode } from "@/modules/problems/actions";
import { getJudge0languageId } from "@/lib/judge0";
// import { executeCode } from "@/modules/problems/actions/execute-code";

import type { Problem, Submission } from "@/generated/prisma/client";

type Language = "CPP" | "PYTHON" | "JAVA";

interface TestCase {
  input: string;
  output: string;
}

function isTestCaseArray(value: unknown): value is TestCase[] {
  return (
    Array.isArray(value) &&
    value.every(
      (tc): tc is TestCase =>
        typeof tc === "object" &&
        tc !== null &&
        !Array.isArray(tc) &&
        "input" in tc &&
        typeof tc.input === "string" &&
        "output" in tc &&
        typeof tc.output === "string",
    )
  );
}

interface ExecutionResponse {
  success: boolean;
  allPassed?: boolean;
  submission?: Submission;
  testCaseResults?: ExecutionTestCaseResult[];
  error?: string;
}

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

export function useEditor(
  problem: Problem | null,
  initialLanguage: Language = "CPP",
) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(initialLanguage);

  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] =
    useState<ExecutionResponse | null>(null);

  useEffect(() => {
    if (!problem) return;
    const frame = window.requestAnimationFrame(() => {
      const snippets = problem.codeSnippets;
      if (
        typeof snippets === "object" &&
        snippets !== null &&
        !Array.isArray(snippets)
      ) {
        const languageCode = snippets[selectedLanguage];
        if (typeof languageCode === "string") {
          setCode(languageCode);
        }
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);

    const snippets = problem?.codeSnippets;
    if (
      typeof snippets === "object" &&
      snippets !== null &&
      !Array.isArray(snippets)
    ) {
      const languageCode = snippets[language];
      if (typeof languageCode === "string") {
        setCode(languageCode);
      }
    }
  };

  const handleRun = async () => {
    if (!problem || !code.trim()) {
      toast.error("Please write some code first.");
      return;
    }

    try {
      setIsRunning(true);

      const languageId = getJudge0languageId(selectedLanguage);

      if (!languageId) {
        throw new Error("Unsupported programming language.");
      }

      const testCases = problem.testCases;

      if (!Array.isArray(testCases)) {
        throw new Error("Invalid test cases.");
      }

      // const response = await executeCode(
      //   code,
      //   languageId,
      //   stdin,
      //   expectedOutputs,
      //   problem.id,
      // );

      // setExecutionResponse(response);

      // if (response.success) {
      //   toast.success("Code executed successfully.");
      // } else {
      //   toast.error("Code execution failed.");
      // }
    } catch (error) {
      console.error("Error executing code:", error);

      toast.error(
        error instanceof Error ? error.message : "Error executing code.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;

    try {
      setIsSubmitting(true);

      if (!code.trim()) {
        toast.error("Please write some code first.");
        return;
      }

      const testCases = problem.testCases;

      if (!isTestCaseArray(testCases) || testCases.length === 0) {
        throw new Error("Invalid or missing test cases.");
      }

      const languageId = getJudge0languageId(selectedLanguage);

      if (!languageId) {
        throw new Error("Unsupported programming language.");
      }

      const stdin = testCases.map((tc) => tc.input);
      const expectedOutputs = testCases.map((tc) => tc.output);

      const res = await executeCode(
        code,
        languageId,
        stdin,
        expectedOutputs,
        problem.id,
      );

      setExecutionResponse(res);

      if (res.success && res.allPassed) {
        toast.success("Accepted! All test cases passed.");
      } else if (res.success) {
        toast.error("Some test cases failed.");
      } else {
        toast.error(res.error || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting code:", error);

      toast.error(
        error instanceof Error ? error.message : "Error submitting code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  };
}
