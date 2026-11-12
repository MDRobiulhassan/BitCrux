"use client";

import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  FieldError,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import type { ProblemFormValues } from "@/modules/problems/schema";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<ProblemFormValues>;
}

interface FieldProps {
  register: UseFormRegister<ProblemFormValues>;
}

interface ConstraintsFieldProps extends FieldProps {
  error?: FieldError;
}

export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          Additional Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <ConstraintsField register={register} error={errors.constraints} />

        <HintsField register={register} />

        <EditorialField register={register} />
      </CardContent>
    </Card>
  );
}

function ConstraintsField({ register, error }: ConstraintsFieldProps) {
  return (
    <div>
      <Label htmlFor="constraints" className="font-medium">
        Constraints
      </Label>

      <Textarea
        id="constraints"
        {...register("constraints")}
        placeholder="Enter problem constraints"
        className="mt-2 min-h-24 resize-y font-mono"
      />

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function HintsField({ register }: FieldProps) {
  return (
    <div>
      <Label htmlFor="hints" className="font-medium">
        Hints (Optional)
      </Label>

      <Textarea
        id="hints"
        {...register("hints")}
        placeholder="Enter hints for solving the problem"
        className="mt-2 min-h-24 resize-y"
      />
    </div>
  );
}

function EditorialField({ register }: FieldProps) {
  return (
    <div>
      <Label htmlFor="editorial" className="font-medium">
        Editorial (Optional)
      </Label>

      <Textarea
        id="editorial"
        {...register("editorial")}
        placeholder="Enter problem editorial/solution explanation"
        className="mt-2 min-h-32 resize-y"
      />
    </div>
  );
}
