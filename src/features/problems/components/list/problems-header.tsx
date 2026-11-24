"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, Plus } from "lucide-react";

interface ProblemsHeaderProps {
  onCreatePlaylist: () => void;
  canCreatePlaylist: boolean;
}

export function ProblemsHeader({
  onCreatePlaylist,
  canCreatePlaylist,
}: ProblemsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
        <p className="text-muted-foreground">Find and solve coding problems</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {canCreatePlaylist && (
          <>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/playlists">
                <List className="h-4 w-4" />
                My Playlists
              </Link>
            </Button>
            <Button onClick={onCreatePlaylist} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
