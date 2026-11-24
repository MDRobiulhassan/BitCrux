"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function onBoardUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No Authenticated User found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;
    const email = emailAddresses[0]?.emailAddress || null;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email,
      },
      create: {
        clerkId: id,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email,
      },
    });

    return { success: true as const };
  } catch (error) {
    console.error("Error onboarding user:", error);
    return { success: false as const, error: "Failed to onboard user" };
  }
}
