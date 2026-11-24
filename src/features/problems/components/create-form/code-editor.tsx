"use client";

import { Editor } from "@monaco-editor/react";

const LANGUAGE_MAP = {
  cpp: "cpp",
  python: "python",
  java: "java",
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_MAP;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: SupportedLanguage;
}

export function CodeEditor({
  value,
  onChange,
  language = "cpp",
}: CodeEditorProps) {
  return (
    <div className="border rounded-md bg-slate-950 text-slate-50 overflow-hidden">
      <div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">
        {language.toUpperCase()}
      </div>

      <div className="h-[300px] w-full">
        <Editor
          height="300px"
          language={LANGUAGE_MAP[language]}
          theme="vs-dark"
          value={value}
          onChange={(value) => onChange(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
