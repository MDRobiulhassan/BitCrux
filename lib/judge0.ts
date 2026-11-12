import axios from "axios";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const headers = {
  Authorization: JUDGE0_API_KEY!,
  "Content-Type": "application/json",
};

export function getJudge0languageId(language: string) {
  const languageMap = {
    cpp: 54,
    java: 62,
    python: 71,
  };

  return languageMap[language.toLowerCase() as keyof typeof languageMap];
}

export async function submitBatch(submissions: any[]) {
  const options = {
    method: "POST",
    url: `${JUDGE0_API_URL}/submissions/batch`,
    params: {
      base64_encoded: "false",
    },
    headers,
    data: {
      submissions,
    },
  };

  const { data } = await axios.request(options);

  return data;
}

export async function pollBatchResults(tokens: string[]) {
  const startTime = Date.now();
  const timeout = 30000;

  while (Date.now() - startTime < timeout) {
    const options = {
      method: "GET",
      url: `${JUDGE0_API_URL}/submissions/batch`,
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers,
    };

    const { data } = await axios.request(options);

    const results = data.submissions;

    const isAllDone = results.every(
      (result: any) => result.status.id !== 1 && result.status.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }

  throw new Error("Judge0 submission polling timed out");
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
