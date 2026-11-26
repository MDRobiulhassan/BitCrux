import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDifficultyColor } from "../../constants";
import type { PublicProblem } from "@/features/problems/types";

interface ProblemHeaderProps {
  problem: PublicProblem;
}

export function ProblemHeader({ problem }: ProblemHeaderProps) {
  return (
    <div className="mb-6">
      <div>
        <div className="mb-4 flex items-center gap-4">
          <Link href="/problems">
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>

          <h1 className="text-3xl font-bold">{problem.title}</h1>

          <Badge
            className={cn(
              "font-medium",
              getDifficultyColor(problem.difficulty),
            )}
          >
            {problem.difficulty.charAt(0) +
              problem.difficulty.slice(1).toLowerCase()}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
