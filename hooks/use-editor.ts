"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getJudge0languageId } from "@/lib/judge0";
// import { executeCode } from "@/modules/problems/actions/execute-code";

import type { Problem } from "@/generated/prisma/client";

type Language = "CPP" | "PYTHON" | "JAVA";

interface ExecutionResponse {
  success: boolean;
  [key: string]: unknown;
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
  }, [selectedLanguage, problem?.id]);

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

      const stdin = testCases.map((testCase) => {
        if (
          typeof testCase !== "object" ||
          testCase === null ||
          !("input" in testCase) ||
          typeof testCase.input !== "string"
        ) {
          throw new Error("Invalid test case input.");
        }

        return testCase.input;
      });

      const expectedOutputs = testCases.map((testCase) => {
        if (
          typeof testCase !== "object" ||
          testCase === null ||
          !("output" in testCase) ||
          typeof testCase.output !== "string"
        ) {
          throw new Error("Invalid expected output.");
        }

        return testCase.output;
      });

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
    toast.info("Submission functionality is not implemented yet.");
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  };
}
