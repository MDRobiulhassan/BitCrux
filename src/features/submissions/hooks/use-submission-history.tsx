import { useCallback, useEffect, useState } from "react";
import { getAllSubmissionByCurrentUserForProblem } from "@/features/submissions/actions/get-submission-history";
import type { Submission } from "@/generated/prisma/client";

function mergeSubmissions(
  existing: Submission[],
  incoming: Submission[],
): Submission[] {
  const submissionsById = new Map(
    existing.map((submission) => [submission.id, submission]),
  );

  for (const submission of incoming) {
    submissionsById.set(submission.id, submission);
  }

  return Array.from(submissionsById.values()).sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export function useSubmissionHistory(id: string, enabled = true) {
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);
  const addSubmission = useCallback((submission: Submission) => {
    setSubmissionHistory((current) => mergeSubmissions(current, [submission]));
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    const fetchSubmissionHistory = async () => {
      try {
        const response = await getAllSubmissionByCurrentUserForProblem(id);
        if (active && response.success) {
          setSubmissionHistory((current) =>
            mergeSubmissions(current, response.data),
          );
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
    addSubmission,
  };
}
