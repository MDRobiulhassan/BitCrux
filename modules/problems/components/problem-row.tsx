"use client";

import Link from "next/link";
import { Bookmark, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";

import { getDifficultyColor } from "../constant";
import type { Problem, User } from "@/generated/prisma/client";

interface ProblemRowProps {
  problem: Problem & {
    solvedBy?: unknown[];
  };
  user?: Pick<User, "role"> | null;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
}

export function ProblemRow({
  problem,
  user,
  onDelete,
  onSave,
}: ProblemRowProps) {
  const isSolved = (problem.solvedBy?.length ?? 0) > 0;

  return (
    <TableRow>
      <TableCell>
        <SolvedCheckbox checked={isSolved} />
      </TableCell>

      <TableCell className="font-medium">
        <ProblemTitle id={problem.id} title={problem.title} />
      </TableCell>

      <TableCell>
        <TagsList tags={problem.tags} />
      </TableCell>

      <TableCell>
        <DifficultyBadge difficulty={problem.difficulty} />
      </TableCell>

      <TableCell>
        <ActionButtons
          problemId={problem.id}
          isAdmin={user?.role === "ADMIN"}
          onDelete={onDelete}
          onSave={onSave}
        />
      </TableCell>
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
  id: string;
  title: string;
}

function ProblemTitle({ id, title }: ProblemTitleProps) {
  return (
    <Link
      href={`/problem/${id}`}
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
  difficulty: keyof typeof import("../constant").DIFFICULTY_COLORS;
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
  isAdmin: boolean;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
}

function ActionButtons({
  problemId,
  isAdmin,
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
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" disabled>
            <PencilIcon className="h-4 w-4" />
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSave(problemId)}
        className="gap-2"
      >
        <Bookmark className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
}
