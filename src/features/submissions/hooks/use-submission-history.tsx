import { useEffect, useState } from "react";
import { getAllSubmissionByCurrentUserForProblem } from "@/features/submissions/actions/get-submission-history";
import type { Submission } from "@/generated/prisma/client";

export function useSubmissionHistory(id: string, enabled = true) {
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    const fetchSubmissionHistory = async () => {
      try {
        const response = await getAllSubmissionByCurrentUserForProblem(id);
        if (active && response.success) {
          setSubmissionHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching submission history:", error);
      }
    };

    fetchSubmissionHistory();

    return () => {
      active = false;
    };
  }, [enabled, id]);

  return {
    submissionHistory: enabled ? submissionHistory : [],
  };
}
