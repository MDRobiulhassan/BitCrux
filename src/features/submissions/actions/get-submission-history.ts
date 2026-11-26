"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function getAllSubmissionByCurrentUserForProblem(
  problemId: string,
) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { success: false as const, data: [] };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true },
  });

  if (!user) {
    return { success: false as const, data: [] };
  }

  const submissions = await prisma.submission.findMany({
    where: { problemId, userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return { success: true as const, data: submissions };
}
