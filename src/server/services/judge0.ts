import "server-only";

import axios from "axios";
import { env } from "@/server/env";

const headers = {
  Authorization: env.JUDGE0_API_KEY,
  "Content-Type": "application/json",
};

export function getLanguageName(languageId: number) {
  const LANGUAGE_NAME = {
    54: "C++",
    62: "Java",
    71: "Python",
  };

  return LANGUAGE_NAME[languageId as keyof typeof LANGUAGE_NAME] || "Unknown";
}

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
  base64_encoded?: boolean;
  wait?: boolean;
}

export interface Judge0SubmitResponse {
  token: string;
}

interface Judge0Status {
  id: number;
  description: string;
}

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status;
  memory: number | null;
  time: string | null;
}

export function decodeJudge0Text(value: string | null): string | null {
  if (!value) return null;

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0) {
    return value;
  }

  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    return /^[\x09-\x0d\x20-\x7e]*$/.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

export async function submitBatch(submissions: Judge0Submission[]) {
  const plainTextSubmissions = submissions.map((submission) => ({
    ...submission,
    base64_encoded: false,
  }));

  const options = {
    method: "POST",
    url: `${env.JUDGE0_API_URL}/submissions/batch`,
    params: {
      base64_encoded: "false",
    },
    headers,
    data: {
      submissions: plainTextSubmissions,
    },
  };

  const { data } = await axios.request<Judge0SubmitResponse[]>(options);

  return data;
}

export async function pollBatchResults(tokens: string[]) {
  const startTime = Date.now();
  const timeout = 30000;

  while (Date.now() - startTime < timeout) {
    const options = {
      method: "GET",
      url: `${env.JUDGE0_API_URL}/submissions/batch`,
      params: {
        tokens: tokens.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers,
    };

    const { data } = await axios.request<{ submissions: Judge0Result[] }>(options);

    const results = data.submissions;

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }

  throw new Error("Judge0 submission polling timed out");
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
