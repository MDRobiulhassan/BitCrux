import { useState, useMemo } from "react";
import type { Problem } from "@/generated/prisma/client";

interface UseProblemFiltersProps {
  problems?: Problem[];
}

export function useProblemFilters({ problems = [] }: UseProblemFiltersProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();

    problems.forEach((problem) => {
      problem.tags?.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;

      const matchesTag =
        selectedTag === "All" || problem.tags.includes(selectedTag);

      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, search, difficulty, selectedTag]);

  return {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    selectedTag,
    setSelectedTag,
    allTags,
    filteredProblems,
  };
}
