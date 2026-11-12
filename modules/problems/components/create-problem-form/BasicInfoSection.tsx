"use client";

import { Controller } from "react-hook-form";
import type {
  Control,
  FieldError,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DIFFICULTY_OPTIONS,
  type ProblemFormValues,
} from "@/modules/problems/schema";

interface BasicInfoSectionProps {
  form: UseFormReturn<ProblemFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TitleField register={register} error={errors.title} />

      <DescriptionField register={register} error={errors.description} />

      <DifficultyField control={control} error={errors.difficulty} />
    </div>
  );
}

interface TextFieldProps {
  register: UseFormRegister<ProblemFormValues>;
  error?: FieldError;
}

function TitleField({ register, error }: TextFieldProps) {
  return (
    <div className="md:col-span-2">
      <Label htmlFor="title" className="text-lg font-semibold">
        Title
      </Label>

      <Input
        id="title"
        {...register("title")}
        placeholder="Enter the problem title..."
        className="mt-2 text-lg"
      />

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function DescriptionField({ register, error }: TextFieldProps) {
  return (
    <div className="md:col-span-2">
      <Label htmlFor="description" className="text-lg font-semibold">
        Description
      </Label>

      <Textarea
        id="description"
        {...register("description")}
        placeholder="Enter the problem description..."
        className="mt-2 min-h-40"
      />

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

interface DifficultyFieldProps {
  control: Control<ProblemFormValues>;
  error?: FieldError;
}

function DifficultyField({ control, error }: DifficultyFieldProps) {
  return (
    <div>
      <Label htmlFor="difficulty" className="text-lg font-semibold">
        Difficulty
      </Label>

      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => {
          const selectedOption = DIFFICULTY_OPTIONS.find(
            (option) => option.value === field.value,
          );

          return (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="difficulty" className="mt-2">
                <SelectValue placeholder="Select difficulty">
                  {selectedOption && (
                    <span className={selectedOption.className}>
                      {selectedOption.label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.className}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
