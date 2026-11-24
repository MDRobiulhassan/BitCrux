import Link from "next/link";
import { ArrowLeft, List, Search } from "lucide-react";
import type { Difficulty } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaylistProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
}

interface PlaylistDetailProps {
  playlist: {
    id: string;
    name: string;
    description: string | null;
    problemPlaylists: { problem: PlaylistProblem }[];
  };
}

const difficultyStyles: Record<Difficulty, string> = {
  EASY: "text-green-700 dark:text-green-400",
  MEDIUM: "text-yellow-700 dark:text-yellow-400",
  HARD: "text-red-700 dark:text-red-400",
};

export function PlaylistDetail({ playlist }: PlaylistDetailProps) {
  const problems = playlist.problemPlaylists.map(({ problem }) => problem);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <Button asChild variant="outline" className="gap-2">
        <Link href="/playlists">
          <ArrowLeft className="size-4" />
          All playlists
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <List className="size-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {playlist.name}
            </h1>
          </div>
          {playlist.description && (
            <p className="max-w-2xl text-muted-foreground">
              {playlist.description}
            </p>
          )}
        </div>
        <Badge variant="secondary">
          {problems.length} {problems.length === 1 ? "problem" : "problems"}
        </Badge>
      </div>

      {problems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Search className="size-8 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">This playlist is empty</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add problems to it from the problems page.
              </p>
            </div>
            <Button asChild>
              <Link href="/problems">Browse problems</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Problems in this playlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {problems.map((problem) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.slug}`}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="font-medium hover:text-amber-600 dark:hover:text-amber-400">
                    {problem.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm font-medium ${difficultyStyles[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
