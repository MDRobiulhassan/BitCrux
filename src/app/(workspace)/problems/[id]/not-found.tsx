import Link from "next/link";

export default function ProblemNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Problem not found</h1>
      <p className="text-muted-foreground">
        The problem you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/problems" className="text-primary underline">
        Back to problems
      </Link>
    </div>
  );
}
