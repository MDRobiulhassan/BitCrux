import type { Submission } from "@/generated/prisma/client";

export interface ProfileStatsProps {
  submissions: Pick<Submission, "status">[];
  solvedCount: number;
  playlistCount: number;
}
