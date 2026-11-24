import { getProblemById } from "@/features/problems/actions/get-problem";
import ProblemWorkspace from "@/features/problems/components/workspace/problem-workspace";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
