"use client";

import Link from "next/link";
import { Bookmark, Check, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";

import { DIFFICULTY_COLORS, getDifficultyColor } from "../../constants";
import type { User } from "@/generated/prisma/client";
import type { ProblemListItem } from "@/features/problems/types";

interface ProblemRowProps {
  problem: ProblemListItem;
  user?: Pick<User, "role"> | null;
  isSaved: boolean;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
}

export function ProblemRow({
  problem,
  user,
  isSaved,
  onDelete,
  onSave,
}: ProblemRowProps) {
  return (
    <TableRow>
      <TableCell>
        <SolvedCheckbox checked={problem.isSolved} />
      </TableCell>

      <TableCell className="font-medium">
        <ProblemTitle slug={problem.slug} title={problem.title} />
      </TableCell>

      <TableCell>
        <TagsList tags={problem.tags} />
      </TableCell>

      <TableCell>
        <DifficultyBadge difficulty={problem.difficulty} />
      </TableCell>

      {user && (
        <TableCell>
          <ActionButtons
            problemId={problem.id}
            problemSlug={problem.slug}
            isAdmin={user.role === "ADMIN"}
            isSaved={isSaved}
            onDelete={onDelete}
            onSave={onSave}
          />
        </TableCell>
      )}
    </TableRow>
  );
}

interface SolvedCheckboxProps {
  checked: boolean;
}

function SolvedCheckbox({ checked }: SolvedCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      disabled
      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
    />
  );
}

interface ProblemTitleProps {
  slug: string;
  title: string;
}

function ProblemTitle({ slug, title }: ProblemTitleProps) {
  return (
    <Link
      href={`/problems/${slug}`}
      className="text-primary hover:underline transition-colors"
    >
      {title}
    </Link>
  );
}

interface TagsListProps {
  tags?: string[];
}

function TagsList({ tags = [] }: TagsListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, idx) => (
        <Badge
          key={`${tag}-${idx}`}
          variant="outline"
          className="text-xs bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

interface DifficultyBadgeProps {
  difficulty: keyof typeof DIFFICULTY_COLORS;
}

function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge className={`${getDifficultyColor(difficulty)} border-0 font-medium`}>
      {difficulty}
    </Badge>
  );
}

interface ActionButtonsProps {
  problemId: string;
  problemSlug: string;
  isAdmin: boolean;
  isSaved: boolean;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
}

function ActionButtons({
  problemId,
  problemSlug,
  isAdmin,
  isSaved,
  onDelete,
  onSave,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(problemId)}
            aria-label="Delete problem"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button asChild variant="outline" size="sm" aria-label="Edit problem">
            <Link href={`/problems/${problemSlug}/edit`}>
              <PencilIcon className="h-4 w-4" />
            </Link>
          </Button>
        </>
      )}

      <Button
        variant={isSaved ? "secondary" : "outline"}
        size="sm"
        onClick={() => onSave(problemId)}
        className="gap-2"
        aria-label={isSaved ? "Add to another playlist" : "Save to playlist"}
      >
        {isSaved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
      </Button>
    </div>
  );
}
