import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
