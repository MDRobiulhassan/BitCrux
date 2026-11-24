import { getProblemById } from "@/features/problems/actions/get-problem";
import { useEffect, useState } from "react";
import type { Problem } from "@/generated/prisma/client";

export function useProblem(id: string) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);

        const problemData = await getProblemById(id);

        if (problemData?.success && problemData.data) {
          setProblem(problemData.data);
        } else {
          setProblem(null);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  return {
    problem,
    isLoading,
  };
}
