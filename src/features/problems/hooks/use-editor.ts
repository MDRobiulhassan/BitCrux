"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { executeCode } from "@/features/submissions/actions/execute-code";
import { getJudge0LanguageId } from "@/features/problems/constants/languages";
import {
  isProblemTestCaseArray,
  type ProblemLanguage,
} from "@/features/problems/types";
import type { Problem } from "@/generated/prisma/client";
import type { CodeExecutionResponse } from "@/features/submissions/types";

export function useEditor(
  problem: Problem | null,
  initialLanguage: ProblemLanguage = "CPP",
) {
  const [selectedLanguage, setSelectedLanguage] = useState<ProblemLanguage>(
    initialLanguage,
  );

  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] =
    useState<CodeExecutionResponse | null>(null);

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

  const handleLanguageChange = (language: ProblemLanguage) => {
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

      const languageId = getJudge0LanguageId(selectedLanguage);

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

      if (!isProblemTestCaseArray(testCases) || testCases.length === 0) {
        throw new Error("Invalid or missing test cases.");
      }

      const languageId = getJudge0LanguageId(selectedLanguage);

      if (!languageId) {
        throw new Error("Unsupported programming language.");
      }

      const stdin = testCases.map((testCase) => testCase.input);
      const expectedOutputs = testCases.map((testCase) => testCase.output);

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
