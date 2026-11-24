import { getAllProblems } from "@/features/problems/actions/get-problems";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getAllProblems();

  if (!result.success) {
    const status = result.error === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: result.error },
      { status },
    );
  }

  return NextResponse.json({ success: true, data: result.data });
}
