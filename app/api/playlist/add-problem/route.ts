import { prisma } from "@/lib/db";
import { getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user || !("id" in user)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { problemId, playlistId } = await req.json();

    if (!problemId || !playlistId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: user.id,
      },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, message: "Playlist not found" },
        { status: 404 },
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, message: "Problem not found" },
        { status: 404 },
      );
    }

    const problemPlaylist = await prisma.problemPlaylist.create({
      data: {
        playlistId,
        problemId,
      },
    });

    return NextResponse.json({
      success: true,
      data: problemPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to playlist:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
