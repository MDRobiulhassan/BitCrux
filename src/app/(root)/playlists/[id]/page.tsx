import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PlaylistDetail } from "@/features/playlists/components/playlist-detail";
import { getPlaylist } from "@/features/playlists/actions/get-playlist";

export const metadata: Metadata = {
  title: "Playlist",
};

export const dynamic = "force-dynamic";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPlaylist(id);

  if (!result.success) {
    if (result.error === "Unauthorized") {
      redirect("/sign-in");
    }

    if (result.error === "Playlist not found") {
      notFound();
    }

    return (
      <section className="mx-auto min-h-screen max-w-7xl px-4 pb-12 pt-32">
        <p role="alert" className="text-destructive">
          Unable to load this playlist. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pb-12 pt-32">
      <PlaylistDetail playlist={result.data} />
    </section>
  );
}
