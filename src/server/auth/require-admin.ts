import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/server/db";

export async function requireAdmin() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { authorized: false as const, status: 401 as const };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true, firstName: true, role: true },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return { authorized: false as const, status: 403 as const };
  }

  return { authorized: true as const, user };
}
