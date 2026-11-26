import type { Metadata } from "next";
import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { SubmissionHistory } from "@/features/submissions";
import {
  PlaylistSection,
  ProfileStats,
  SolvedProblems,
  UserInfoCard,
} from "@/features/profile";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your coding progress, submissions, and playlists.",
};

const ProfilePage = async () => {
  const profileData = await getCurrentUserData();

  if (!profileData.success && profileData.error === "Unauthenticated") {
    redirect("/sign-in");
  }

  if (!profileData.success) {
    return (
      <div className="container mx-auto min-h-screen max-w-7xl px-4 py-32">
        <p role="alert" className="text-center text-destructive">
          We couldn&apos;t load your profile. Please refresh the page or try
          again later.
        </p>
      </div>
    );
  }

  const userData = profileData.data;

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={userData} />

        <ProfileStats
          submissions={userData.submissions}
          solvedCount={userData.solvedProblems.length}
          playlistCount={userData.playlists.length}
        />

        <SubmissionHistory submissions={userData.submissions} />

        <div className="grid gap-8">
          <SolvedProblems solvedProblems={userData.solvedProblems} />
          <PlaylistSection playlists={userData.playlists} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
