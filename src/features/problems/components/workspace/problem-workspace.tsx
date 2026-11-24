"use client";

import { useUser } from "@clerk/nextjs";
import { useEditor } from "@/features/problems/hooks/use-editor";
import { useSubmissionHistory } from "@/features/submissions";
import CodeEditorPanel from "@/features/problems/components/editor/code-editor-panel";
import { ExecutionResults } from "@/features/problems/components/editor/execution-results";
import { ProblemDescription } from "@/features/problems/components/detail/problem-description";
import { ProblemHeader } from "@/features/problems/components/detail/problem-header";
import { ProblemTabs } from "@/features/problems/components/detail/problem-tabs";
import TestCasesPanel from "@/features/problems/components/editor/testcases-panel";
import type { Problem } from "@/generated/prisma/client";

const ProblemWorkspace = ({ problem }: { problem: Problem }) => {
  const { isLoaded: authLoaded, isSignedIn } = useUser();
  const isAuthenticated = authLoaded && Boolean(isSignedIn);
  const { submissionHistory } = useSubmissionHistory(
    problem.id,
    isAuthenticated,
  );

  const {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  } = useEditor(problem);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <ProblemHeader problem={problem} />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            <ProblemDescription problem={problem} />
            <ProblemTabs
              problem={problem}
              submissionHistory={submissionHistory}
            />
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              isAuthenticated={isAuthenticated}
              authLoaded={authLoaded}
            />

            <TestCasesPanel
              testCases={
                Array.isArray(problem.testCases)
                  ? problem.testCases.filter(
                      (testCase): testCase is { input: string; output: string } =>
                        typeof testCase === "object" &&
                        testCase !== null &&
                        "input" in testCase &&
                        typeof testCase.input === "string" &&
                        "output" in testCase &&
                        typeof testCase.output === "string",
                    )
                  : []
              }
            />

            <ExecutionResults executionResponse={executionResponse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemWorkspace;
