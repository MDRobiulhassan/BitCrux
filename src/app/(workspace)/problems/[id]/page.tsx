import type { Metadata } from "next";
import { getProblemById } from "@/features/problems/actions/get-problem";
import { ProblemWorkspace } from "@/features/problems";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getProblemById(id);

  return {
    title: result.success && result.data ? result.data.title : "Problem",
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProblemById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProblemWorkspace problem={result.data} />;
}
