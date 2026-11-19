"use client";

import { useRouter } from "next/navigation";
import { ProblemsHeader } from "./problems-header";
import { useProblemFilters } from "../hooks/use-problem-filters";
import { ProblemsFilters } from "./problem-filters";
import { usePagination } from "../hooks/use-pagination";
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
import type { Problem, User } from "@/generated/prisma/client";

interface ProblemsTableProps {
  problems?: Problem[];
  user?: Pick<User, "role"> | null;
}

const ProblemsTable = ({ problems = [], user }: ProblemsTableProps) => {
  const router = useRouter();
  const filters = useProblemFilters({ problems });
  const pagination = usePagination(filters.filteredProblems);

 // Delete problem
  const handleDelete = async (problemId: string) => {
    // Call your delete API here
  };

  // Save problem to playlist
  const handleSave = (problemId: string) => {
    // Open AddToPlaylistModal for this problem
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ProblemsHeader
        onCreatePlaylist={() => router.push("/playlists/create")}
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
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    onDelete={handleDelete}
                    onSave={handleSave}
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

      {/* <CreatePlaylistModal
        isOpen={playlist.isCreateModalOpen}
        onClose={playlist.closeCreateModal}
        onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={playlist.isAddToPlaylistModalOpen}
        onClose={playlist.closeAddToPlaylistModal}
        onSubmit={playlist.handleAddToPlaylist}
        problemId={playlist.selectedProblemId}
      /> */}
    </div>
  );

};


export default ProblemsTable;
