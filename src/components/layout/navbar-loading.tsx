import { Skeleton } from "@/components/ui/skeleton";

export function NavbarLoading() {
  return (
    <nav
      aria-label="Loading navigation"
      className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-4"
    >
      <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-background/80 px-6 py-4 shadow-lg backdrop-blur-md dark:border-white/10">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </nav>
  );
}
