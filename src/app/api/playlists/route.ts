import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { prisma } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUserData();

    if (!user || !("id" in user)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        problemPlaylists: {
          include: {
            problem: {
              select: { id: true, title: true, difficulty: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
