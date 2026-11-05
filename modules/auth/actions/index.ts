"use server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No Authenticated User found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;
    const newUser = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0].emailAddress || null,
      },
      create: {
        clerkId: id,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0].emailAddress || null,
      },
    });
  } catch (error) {}
};

export const currentUserRole = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false as const, role: null };
    }

    const userRole = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    return {
      success: true as const,
      role: userRole?.role ?? null,
    };
  } catch (error) {
    console.error("Error fetching user role:", error);

    return { success: false as const, role: null };
  }
};
