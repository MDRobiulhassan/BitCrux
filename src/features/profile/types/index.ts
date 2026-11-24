import type { Submission } from "@/generated/prisma/client";

export interface ProfileStatsProps {
  submissions: Submission[];
  solvedCount: number;
  playlistCount: number;
}
