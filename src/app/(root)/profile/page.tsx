import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { SubmissionHistory } from "@/features/submissions/components/submit-history";
import PlaylistsSection from "@/features/profile/components/playlist-section";
import ProfileStats from "@/features/profile/components/profile-stats";
import SolvedProblems from "@/features/profile/components/solved-problems";
import UserInfoCard from "@/features/profile/components/user-info-card";
import React from "react";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const profileData = await getCurrentUserData();

  if (!profileData || "error" in profileData) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={profileData.submissions}
          solvedCount={profileData.solvedProblems.length}
          playlistCount={profileData.playlists.length}
        />

        <SubmissionHistory submissions={profileData.submissions} />

        <div className="grid gap-8">
          <SolvedProblems solvedProblems={profileData.solvedProblems} />
          <PlaylistsSection playlists={profileData.playlists} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
