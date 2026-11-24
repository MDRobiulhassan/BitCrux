import { Skeleton } from "@/components/ui/skeleton";

export function NavbarLoading() {
  return (
    <nav
      aria-label="Loading navigation"
      className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-2 sm:px-4"
    >
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/20 bg-background/80 px-3 py-3 shadow-lg backdrop-blur-md sm:px-6 sm:py-4 dark:border-white/10">
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="size-8 rounded-full sm:size-10" />
          <Skeleton className="h-5 w-20 sm:h-6 sm:w-28" />
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8 md:h-8 md:w-20" />
        </div>
      </div>
    </nav>
  );
}
