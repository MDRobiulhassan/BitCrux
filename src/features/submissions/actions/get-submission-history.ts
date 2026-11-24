"use server";

import "server-only";

import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { prisma } from "@/server/db";

export async function getAllSubmissionByCurrentUserForProblem(
  problemId: string,
) {
  const user = await getCurrentUserData();

  if (!user || !("id" in user)) {
    return { success: false as const, data: [] };
  }

  const submissions = await prisma.submission.findMany({
    where: { problemId, userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return { success: true as const, data: submissions };
}
