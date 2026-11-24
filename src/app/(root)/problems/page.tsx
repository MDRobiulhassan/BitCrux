import { getAllProblems } from "@/features/problems/actions/get-problems";
import { ProblemsTable } from "@/features/problems";

const ProblemPage = async () => {
  const result = await getAllProblems();

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">
          Error loading problems: {result.error}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-32">
      <ProblemsTable
        problems={result.data.problems}
        user={result.data.user}
      />
    </div>
  );
};

export default ProblemPage;
