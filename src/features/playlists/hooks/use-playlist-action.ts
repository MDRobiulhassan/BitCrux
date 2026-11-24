import { useState } from "react";
import { toast } from "sonner";
import type { CreatePlaylistData } from "@/features/playlists/types";
import { createPlaylist } from "@/features/playlists/actions/create-playlist";
import { addProblemToPlaylist } from "@/features/playlists/actions/add-problem-to-playlist";

export function usePlaylistAction() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );

  const handleCreatePlaylist = async (data: CreatePlaylistData) => {
    try {
      const result = await createPlaylist(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsCreateModalOpen(false);
      toast.success("Playlist created successfully");
      return true;
    } catch (error) {
      console.error("Error creating playlist:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create playlist",
      );

      return false;
    }
  };

  const handleAddToPlaylist = async (problemId: string, playlistId: string) => {
    try {
      const result = await addProblemToPlaylist({ problemId, playlistId });

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsAddToPlaylistModalOpen(false);
      toast.success("Problem added to playlist");
      return true;
    } catch (error) {
      console.error("Error adding to playlist:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add problem to playlist",
      );

      return false;
    }
  };

  const openAddToPlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return {
    isCreateModalOpen,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    handleCreatePlaylist,

    isAddToPlaylistModalOpen,
    selectedProblemId,
    openAddToPlaylist,
    closeAddToPlaylistModal: () => {
      setIsAddToPlaylistModalOpen(false);
      setSelectedProblemId(null);
    },
    handleAddToPlaylist,
  };
}
