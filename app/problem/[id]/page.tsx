"use client";

import { Spinner } from "@/components/ui/spinner";
import { useEditor } from "@/hooks/use-editor";
import { useProblem } from "@/hooks/use-problem";
import CodeEditorPanel from "@/modules/problems/components/code-editor-panel";
import { ProblemDescription } from "@/modules/problems/components/problem-description";
import { ProblemHeader } from "@/modules/problems/components/problem-header";
import { ProblemTabs } from "@/modules/problems/components/problem-tabs";
import TestCasesPanel from "@/modules/problems/components/testcases-panel";
import { useParams } from "next/navigation";

const ProblemIdPage = () => {
  const params = useParams<{ id: string }>();
  const { problem, isLoading } = useProblem(params.id);
  //   const { submissionHistory } = useSubmissionHistory(params.id);

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

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Problem Not Found</h1>
        <p className="text-muted-foreground">
          The problem you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <ProblemHeader problem={problem} />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            <ProblemDescription problem={problem} selectedLanguage={"cpp"} />
            <ProblemTabs problem={problem} submissionHistory={[]} />
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
            />

            <TestCasesPanel testCases={problem.testCases} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
