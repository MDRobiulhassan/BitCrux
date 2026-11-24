import Link from "next/link";
import { ArrowRight, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaylistListItem {
  id: string;
  name: string;
  description: string | null;
  problemCount: number;
}

export function PlaylistList({ playlists }: { playlists: PlaylistListItem[] }) {
  if (playlists.length === 0) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <List className="size-7 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">No playlists yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a playlist from the problems page to organize problems.
            </p>
          </div>
          <Button asChild>
            <Link href="/problems">Browse problems</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {playlists.map((playlist) => (
        <Link
          key={playlist.id}
          href={`/playlists/${playlist.id}`}
          className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                  <List className="size-5" />
                </div>
                <Badge variant="secondary">
                  {playlist.problemCount}{" "}
                  {playlist.problemCount === 1 ? "problem" : "problems"}
                </Badge>
              </div>
              <CardTitle className="text-lg transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                {playlist.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 min-h-10">
                {playlist.description || "A personal collection of problems."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto justify-between border-t text-sm text-muted-foreground">
              <span>Open playlist</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}