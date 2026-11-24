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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
}

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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch("/api/playlists");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load playlists");
        }

        setPlaylists(data.playlists);
      } catch (error) {
        console.error("Error loading playlists:", error);
        toast.error("Failed to load playlists");
      }
    };

    if (isOpen) {
      loadPlaylist();
    }
  }, [isOpen]);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      setIsLoading(true);
      const added = await onSubmit(problemId, playlistId);
      if (added) {
        onClose();
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      toast.error("Failed to add problem to playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add this problem to
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] w-full pr-4">
          {playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => (
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
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              <p>No playlists found. Create one first!</p>

              <Button className="mt-2" variant="outline" onClick={onClose}>
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
