"use server";

import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function getCurrentUserData() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false as const, error: "Unauthenticated" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = clerkUser;
    const email = emailAddresses[0]?.emailAddress || null;

    const user = await prisma.user.upsert({
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
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        submissions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            createdAt: true,
            language: true,
            memory: true,
            time: true,
          },
        },
        solvedProblems: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            createdAt: true,
            problem: {
              select: { slug: true, title: true },
            },
          },
        },
        playlists: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return { success: true as const, data: user };
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return { success: false as const, error: "Failed to load profile" };
  }
}
