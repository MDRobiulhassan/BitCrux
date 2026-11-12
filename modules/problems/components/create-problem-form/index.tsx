"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProblem } from "@/hooks/use-create-problem";
import { FormHeader } from "./form-header";
import { BasicInfoSection } from "./BasicInfoSection";
import { TagsSection } from "./tags-section";
import { TestCasesSection } from "./test-cases-section";
import { LanguageSections } from "./language-section";
import { AdditionalInfoSection } from "./additional-info-section";
import { Plus } from "lucide-react";

export function CreateProblemForm() {
  const {
    form,
    testCasesArray,
    isLoading,
    sampleType,
    setSampleType,
    onSubmit,
    loadSampleData,
  } = useCreateProblem();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-xl">
        <FormHeader
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
            <SubmitButton isLoading={isLoading} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex justify-end mt-6">
      <Button type="submit" disabled={isLoading} size="lg" className="gap-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Create Problem
          </>
        )}
      </Button>
    </div>
  );
}
