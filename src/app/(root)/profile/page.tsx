import { getCurrentUserData } from "@/features/auth/actions/get-current-user-data";
import { SubmissionHistory } from "@/features/submissions";
import {
  PlaylistSection,
  ProfileStats,
  SolvedProblems,
  UserInfoCard,
} from "@/features/profile";
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
          <PlaylistSection playlists={profileData.playlists} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
