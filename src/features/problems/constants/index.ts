export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const ITEMS_PER_PAGE = 5;

export const DIFFICULTY_COLORS = {
  EASY: "bg-green-100 text-green-800 hover:bg-green-100",
  MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  HARD: "bg-red-100 text-red-800 hover:bg-red-100",
};

export const getDifficultyColor = (
  difficulty: keyof typeof DIFFICULTY_COLORS,
) => {
  return DIFFICULTY_COLORS[difficulty] ?? "bg-gray-100 text-gray-800";
};

export const LANGUAGE_OPTIONS = [
  { value: "CPP", label: "C++" },
  { value: "PYTHON", label: "Python" },
  { value: "JAVA", label: "Java" },
];

import type { editor } from "monaco-editor";

export const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
  fontSize: 14,
  lineNumbers: "on",
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: "on",
  tabSize: 4,
  padding: {
    top: 16,
    bottom: 16,
  },
};

export const getEditorLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    CPP: "cpp",
    PYTHON: "python",
    JAVA: "java",
  };

  return languageMap[language.toUpperCase()] ?? "plaintext";
};
