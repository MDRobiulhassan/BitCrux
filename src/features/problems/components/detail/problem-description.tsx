import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileText } from "lucide-react";
import { ExampleSection } from "./example-section";
import { ConstraintsSection } from "./constraint-section";

import type { Problem } from "@/generated/prisma/client";

type Example = {
  [key: string]: string | undefined;
  input: string;
  output: string;
  explanation?: string;
};

interface ProblemDescriptionProps {
  problem: Problem;
}

function isExample(value: unknown): value is Example {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const example = value as Record<string, unknown>;

  return (
    typeof example.input === "string" &&
    typeof example.output === "string" &&
    (example.explanation === undefined ||
      typeof example.explanation === "string")
  );
}

export function ProblemDescription({
  problem,
}: ProblemDescriptionProps) {
  const examples: Example[] =
    typeof problem.examples === "object" &&
    problem.examples !== null &&
    !Array.isArray(problem.examples)
      ? Object.values(problem.examples).filter(isExample)
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Problem Description
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>

          {examples.map((example, index) => (
            <ExampleSection key={index} example={example} index={index} />
          ))}

          <ConstraintsSection constraints={problem.constraints} />
        </div>
      </CardContent>
    </Card>
  );
}
