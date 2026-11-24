import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPlaylists } from "@/features/playlists/actions/get-playlists";
import { PlaylistList } from "@/features/playlists/components/playlist-list";

export const metadata: Metadata = {
  title: "My Playlists",
  description: "Browse your saved coding problem playlists.",
};

export const dynamic = "force-dynamic";

export default async function PlaylistsPage() {
  const result = await getPlaylists();

  if (!result.success) {
    if (result.error === "Unauthorized") {
      redirect("/sign-in");
    }

    return (
      <section className="mx-auto min-h-screen max-w-7xl px-4 pb-12 pt-32">
        <p role="alert" className="text-destructive">
          Unable to load playlists. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl space-y-8 px-4 pb-12 pt-32">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Playlists</h1>
        <p className="mt-2 text-muted-foreground">
          Organize problems into collections and pick up where you left off.
        </p>
      </div>
      <PlaylistList
        playlists={result.data.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          problemCount: playlist.problemPlaylists.length,
        }))}
      />
    </section>
  );
}
