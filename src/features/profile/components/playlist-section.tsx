import React from "react";
import Link from "next/link";
import { ArrowRight, List, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Playlist } from "@/generated/prisma/client";

interface PlaylistsSectionProps {
  playlists: Pick<
    Playlist,
    "id" | "name" | "description" | "createdAt" | "updatedAt"
  >[];
}

const PlaylistsSection = ({ playlists }: PlaylistsSectionProps) => {
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <List className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-2xl">Playlists</CardTitle>
          <Badge variant="secondary">{playlists.length}</Badge>
          {playlists.length > 0 && (
            <Link
              href="/playlists"
              className="ml-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Playlists Created</h3>
            <p className="text-muted-foreground">
              Create your first playlist to organize your problems!
            </p>
            <Link
              href="/problems"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Browse problems
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full bg-blue-50 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md dark:bg-blue-950/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800">
                        <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-2 font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {playlist.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {playlist.description ||
                            "Personal problem collection"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>Created {formatDate(playlist.createdAt)}</span>
                      </div>
                      {playlist.createdAt.getTime() !==
                        playlist.updatedAt.getTime() && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          <span>Updated {formatDate(playlist.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                      Open playlist
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistsSection;
