"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, BookOpen } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ProblemFormValues } from "@/modules/problems/schema";

interface TagsSectionProps {
  form: UseFormReturn<ProblemFormValues>;
}

export function TagsSection({ form }: TagsSectionProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const tags = watch("tags");

  const addTag = () => {
    setValue("tags", [...tags, ""], {
      shouldValidate: true,
    });
  };

  const updateTag = (index: number, value: string) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;

    setValue("tags", updatedTags, {
      shouldValidate: true,
    });
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Tags
          </CardTitle>

          <Button type="button" size="sm" onClick={addTag} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Tag
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                placeholder="Enter tag"
                className="flex-1"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTag(index)}
                disabled={tags.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {errors.tags && (
          <p className="text-sm text-red-500 mt-2">{errors.tags.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
