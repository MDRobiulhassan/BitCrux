"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProblemsHeader } from "./problems-header";
import { useProblemFilters } from "@/features/problems/hooks/use-problem-filters";
import { ProblemsFilters } from "./problem-filters";
import { usePagination } from "@/features/problems/hooks/use-pagination";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { ProblemsPagination } from "./problems-pagination";
import type { User } from "@/generated/prisma/client";
import type { ProblemListItem } from "@/features/problems/types";
import { deleteProblem } from "@/features/problems/actions/delete-problem";
import {
  AddToPlaylistModal,
  CreatePlaylistModal,
  usePlaylistAction,
} from "@/features/playlists";

interface ProblemsTableProps {
  problems?: ProblemListItem[];
  user?: Pick<User, "role"> | null;
}

const ProblemsTable = ({ problems = [], user }: ProblemsTableProps) => {
  const router = useRouter();
  const [problemToDelete, setProblemToDelete] =
    useState<ProblemListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const filters = useProblemFilters({ problems });
  const pagination = usePagination(filters.filteredProblems);
  const playlist = usePlaylistAction(
    problems.filter((problem) => problem.isSaved).map((problem) => problem.id),
  );

  const handleDelete = async () => {
    if (!problemToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteProblem(problemToDelete.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(`Deleted "${problemToDelete.title}".`);
      setProblemToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to delete problem.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ProblemsHeader
        onCreatePlaylist={playlist.openCreateModal}
        canCreatePlaylist={Boolean(user)}
      />
      <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}
      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[120px]">Difficulty</TableHead>
                {user && <TableHead className="w-[200px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    isSaved={playlist.savedProblemIds.has(problem.id)}
                    onDelete={(problemId) => {
                      setProblemToDelete(
                        problems.find((item) => item.id === problemId) ?? null,
                      );
                    }}
                    onSave={playlist.openAddToPlaylist}
                  />
                ))
              ) : (
                <ProblemsEmpty />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.showPagination && (
        <ProblemsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          displayRange={pagination.displayRange}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPrevious={pagination.goToPreviousPage}
          onNext={pagination.goToNextPage}
        />
      )}

      <CreatePlaylistModal
        isOpen={playlist.isCreateModalOpen}
        onClose={playlist.closeCreateModal}
        onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={playlist.isAddToPlaylistModalOpen}
        onClose={playlist.closeAddToPlaylistModal}
        onSubmit={playlist.handleAddToPlaylist}
        problemId={playlist.selectedProblemId ?? ""}
      />

      <Dialog
        open={problemToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProblemToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this problem?</DialogTitle>
            <DialogDescription>
              {`"${problemToDelete?.title ?? "This problem"}" and its submissions will be permanently deleted.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProblemToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Problem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemsTable;
