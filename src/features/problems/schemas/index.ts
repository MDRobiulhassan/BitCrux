import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    message: "Invalid difficulty level",
  }),
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required",
  }),
  constraints: z.string().min(1, {
    message: "Constraints are required",
  }),
  hints: z.string().optional(),
  editorial: z.string().optional(),

  testCases: z
    .array(
      z.object({
        input: z.string().min(1, { message: "Input is required" }),
        output: z.string().min(1, { message: "Output is required" }),
      }),
    )
    .min(1, { message: "At least one test case is required" }),

  examples: z.object({
    CPP: z.object({
      input: z.string().min(1, { message: "Input is required" }),
      output: z.string().min(1, { message: "Output is required" }),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, { message: "Input is required" }),
      output: z.string().min(1, { message: "Output is required" }),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, { message: "Input is required" }),
      output: z.string().min(1, { message: "Output is required" }),
      explanation: z.string().optional(),
    }),
  }),

  codeSnippets: z.object({
    CPP: z.string().min(1, {
      message: "C++ code snippet is required",
    }),
    PYTHON: z.string().min(1, {
      message: "Python code snippet is required",
    }),
    JAVA: z.string().min(1, {
      message: "Java code snippet is required",
    }),
  }),

  referenceSolutions: z.object({
    CPP: z.string().min(1, {
      message: "C++ reference solution is required",
    }),
    PYTHON: z.string().min(1, {
      message: "Python reference solution is required",
    }),
    JAVA: z.string().min(1, {
      message: "Java reference solution is required",
    }),
  }),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;

export const defaultFormValues: ProblemFormValues = {
  title: "",
  description: "",
  difficulty: "Easy",
  constraints: "",
  hints: "",
  editorial: "",
  testCases: [
    {
      input: "",
      output: "",
    },
  ],
  tags: [""],

  examples: {
    CPP: {
      input: "",
      output: "",
      explanation: "",
    },
    PYTHON: {
      input: "",
      output: "",
      explanation: "",
    },
    JAVA: {
      input: "",
      output: "",
      explanation: "",
    },
  },

  codeSnippets: {
    CPP: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
    PYTHON: `def solution():
    # Write your code here
    pass`,
    JAVA: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  },

  referenceSolutions: {
    CPP: "// Add your C++ reference solution here",
    PYTHON: "# Add your Python reference solution here",
    JAVA: "// Add your Java reference solution here",
  },
};

export const LANGUAGES = ["CPP", "PYTHON", "JAVA"] as const;

export const DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "Easy", className: "bg-green-100 text-green-800" },
  {
    value: "Medium",
    label: "Medium",
    className: "bg-amber-100 text-amber-800",
  },
  { value: "Hard", label: "Hard", className: "bg-red-100 text-red-800" },
] as const;
