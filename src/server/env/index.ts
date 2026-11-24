import "server-only";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JUDGE0_API_URL: z.url(),
  JUDGE0_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
