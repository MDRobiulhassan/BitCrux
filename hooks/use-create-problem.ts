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

export function useCreateProblem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sampleType, setSampleType] = useState("DP");

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: defaultFormValues,
  });

  const testCasesArray = useFieldArray({
    name: "testCases",
    control: form.control,
  });

  const onSubmit = async (values: ProblemFormValues) => {};

  const loadSampleData = () => {
    const sampleData = sampleProblem;

    if (!sampleData) return;

    form.reset(sampleData);
  };

  return {
    router,
    isLoading,
    setIsLoading,
    sampleType,
    setSampleType,
    form,
    testCasesArray,
    onSubmit,
    loadSampleData,
  };
}
