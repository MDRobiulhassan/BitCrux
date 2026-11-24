import { LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading() {
  return (
    <section
      aria-busy="true"
      className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 pb-12 pt-32"
    >
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 text-sm text-muted-foreground"
      >
        <LoaderCircle
          aria-hidden="true"
          className="size-5 animate-spin text-amber-500"
        />
        <span>Loading BitCrux...</span>
      </div>

      <div className="mt-8 space-y-6">
        <Skeleton className="h-10 w-2/5 max-w-sm" />
        <Skeleton className="h-5 w-3/5 max-w-2xl" />
        <div className="grid gap-5 pt-4 md:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
