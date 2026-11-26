import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateProblemForm } from "@/features/problems";
import { getProblemForAdmin } from "@/features/problems/actions/get-problem";
import { toProblemFormValues } from "@/features/problems/utils/problem-form-values";

export const metadata: Metadata = {
  title: "Edit Problem",
};

export const dynamic = "force-dynamic";

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProblemForAdmin(id);

  if (!result.success && result.error === "Unauthenticated") {
    redirect("/sign-in");
  }

  if (!result.success && result.error === "Unauthorized") {
    redirect("/");
  }

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-12 pt-32">
      <div className="mb-6 flex w-full items-center">
        <Button
          asChild
          variant="outline"
          size="icon"
          aria-label="Back to problem"
        >
          <Link href={`/problems/${result.data.slug}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>
      <CreateProblemForm
        problemId={result.data.id}
        initialValues={toProblemFormValues(result.data)}
      />
    </section>
  );
}
