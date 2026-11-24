import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Skeleton className="h-12 w-2/3" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[32rem] w-full" />
        <Skeleton className="h-[32rem] w-full" />
      </div>
    </div>
  );
}
