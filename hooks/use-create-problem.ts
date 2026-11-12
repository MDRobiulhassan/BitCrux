"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  defaultFormValues,
  problemSchema,
  type ProblemFormValues,
} from "@/modules/problems/schema";
import { sampleProblem } from "@/modules/problems/constant/sample-problem";
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
      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Problem creation failed with HTTP ${response.status}`,
        );
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to create problem");
      }

      toast.success("Problem created successfully!");
      router.push("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Failed to create problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    if (sampleType !== "DP") return;

    form.reset(sampleProblem);
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
