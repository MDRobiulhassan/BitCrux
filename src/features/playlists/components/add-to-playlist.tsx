"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { getPlaylists } from "@/features/playlists/actions/get-playlists";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  problemIds: string[];
}

type PlaylistLoadState =
  | { status: "idle" }
  | { status: "loaded"; playlists: Playlist[] }
  | { status: "error" };

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (problemId: string, playlistId: string) => Promise<boolean>;
  problemId: string;
}

const AddToPlaylistModal = ({
  isOpen,
  onClose,
  onSubmit,
  problemId,
}: AddToPlaylistModalProps) => {
  const [playlistState, setPlaylistState] = useState<PlaylistLoadState>({
    status: "idle",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const result = await getPlaylists();

        if (!result.success) {
          throw new Error(result.error);
        }

        if (active) {
          setPlaylistState({
            status: "loaded",
            playlists: result.data.map((playlist) => ({
              id: playlist.id,
              name: playlist.name,
              description: playlist.description,
              problemIds: playlist.problemPlaylists.map(
                ({ problem }) => problem.id,
              ),
            })),
          });
        }
      } catch (error) {
        console.error("Error loading playlists:", error);
        if (active) {
          setPlaylistState({ status: "error" });
        }
      }
    };

    if (!isOpen || playlistState.status !== "idle") {
      return;
    }

    let active = true;
    void loadPlaylist();

    return () => {
      active = false;
    };
  }, [isOpen, playlistState.status]);

  const closeModal = () => {
    setPlaylistState({ status: "idle" });
    onClose();
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      setIsLoading(true);
      const added = await onSubmit(problemId, playlistId);
      if (added) {
        closeModal();
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      toast.error("Failed to add problem to playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add this problem to
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] w-full pr-4">
          {playlistState.status === "idle" ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading playlists...
            </div>
          ) : playlistState.status === "error" ? (
            <div className="py-4 text-center text-muted-foreground">
              <p>Could not load playlists.</p>
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => setPlaylistState({ status: "idle" })}
              >
                Retry
              </Button>
            </div>
          ) : playlistState.playlists.length > 0 ? (
            <div className="space-y-2">
              {playlistState.playlists.map((playlist) => {
                const alreadyAdded = playlist.problemIds.includes(problemId);

                return (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between rounded-lg border p-2 hover:bg-accent"
                  >
                    <div>
                      <h3 className="font-medium">{playlist.name}</h3>

                      {playlist.description && (
                        <p className="text-sm text-muted-foreground">
                          {playlist.description}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      disabled={isLoading || alreadyAdded}
                    >
                      {alreadyAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              <p>No playlists found. Create one first!</p>

              <Button className="mt-2" variant="outline" onClick={closeModal}>
                Create Playlist
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
