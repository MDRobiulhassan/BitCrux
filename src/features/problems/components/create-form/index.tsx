"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProblem } from "@/features/problems/hooks/use-create-problem";
import { FormHeader } from "./form-header";
import { BasicInfoSection } from "./basic-info-section";
import { TagsSection } from "./tags-section";
import { TestCasesSection } from "./test-cases-section";
import { LanguageSections } from "./language-section";
import { AdditionalInfoSection } from "./additional-info-section";
import { Plus, Save } from "lucide-react";
import type { ProblemFormValues } from "@/features/problems/schemas";

interface CreateProblemFormProps {
  problemId?: string;
  initialValues?: ProblemFormValues;
}

export function CreateProblemForm({
  problemId,
  initialValues,
}: CreateProblemFormProps) {
  const isEditing = Boolean(problemId);
  const {
    form,
    testCasesArray,
    isLoading,
    sampleType,
    setSampleType,
    onSubmit,
    loadSampleData,
  } = useCreateProblem({ problemId, initialValues });

  return (
    <div className="w-full">
      <Card className="shadow-xl">
        <FormHeader
          title={isEditing ? "Edit Problem" : "Create Problem"}
          showSamples={!isEditing}
          sampleType={sampleType}
          setSampleType={setSampleType}
          onLoadSample={loadSampleData}
        />

        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-8">
            <BasicInfoSection form={form} />
            <TagsSection form={form} />
            <TestCasesSection form={form} testCasesArray={testCasesArray} />
            <LanguageSections form={form} />
            <AdditionalInfoSection form={form} />
            <SubmitButton isLoading={isLoading} isEditing={isEditing} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({
  isLoading,
  isEditing,
}: {
  isLoading: boolean;
  isEditing: boolean;
}) {
  return (
    <div className="flex justify-end mt-6">
      <Button type="submit" disabled={isLoading} size="lg" className="gap-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            {isEditing ? "Saving..." : "Creating..."}
          </>
        ) : (
          <>
            {isEditing ? (
              <Save className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {isEditing ? "Save Changes" : "Create Problem"}
          </>
        )}
      </Button>
    </div>
  );
}
