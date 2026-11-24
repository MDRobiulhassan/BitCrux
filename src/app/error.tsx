"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We could not load this page. Please try again.
      </p>
      <button className="rounded-md border px-4 py-2" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
