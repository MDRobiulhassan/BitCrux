"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./form-header";

export function CreateProblemForm() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-xl">
        <FormHeader />

        <CardContent className="p-6"></CardContent>
      </Card>
    </div>
  );
}
