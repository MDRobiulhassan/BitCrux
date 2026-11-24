"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  defaultFormValues,
  problemSchema,
  type ProblemFormValues,
} from "@/features/problems/schemas";
import {
  sampleProblem,
  sampleStringProblem,
} from "@/features/problems/constants/sample-problem";
import { createProblem } from "@/features/problems/actions/create-problem";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useCreateProblem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sampleType, setSampleType] = useState<"DP" | "STRING">("DP");

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: defaultFormValues,
  });

  const testCasesArray = useFieldArray({
    name: "testCases",
    control: form.control,
  });

  const onSubmit = async (values: ProblemFormValues) => {
    try {
      setIsLoading(true);
      const result = await createProblem(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.warning) {
        toast.warning(`Problem created. ${result.warning}`);
      } else {
        toast.success("Problem created successfully!");
      }

      router.push("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create problem",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    form.reset(
      sampleType === "DP" ? sampleProblem : sampleStringProblem,
    );
  };

  return {
    router,
    form,
    testCasesArray,
    isLoading,
    setIsLoading,
    sampleType,
    setSampleType,
    onSubmit: form.handleSubmit(onSubmit),
    loadSampleData,
  };
}
