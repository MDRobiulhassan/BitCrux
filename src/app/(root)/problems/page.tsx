import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { getAllProblems } from "@/features/problems/actions/get-problems";
import { ProblemsTable } from "@/features/problems";

const ProblemPage = async () => {
  const user = await getCurrentUserData();
  const { data: problems, error } = await getAllProblems();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading problems: {error}</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-32">
      <ProblemsTable
        problems={problems}
        user={user && "role" in user ? user : null}
      />
    </div>
  );
};

export default ProblemPage;
