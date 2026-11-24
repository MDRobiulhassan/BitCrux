ALTER TABLE "Problem" ADD COLUMN "slug" TEXT;

WITH numbered_problems AS (
  SELECT
    "id",
    COALESCE(
      NULLIF(
        trim(BOTH '-' FROM regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'problem'
    ) || '-' || row_number() OVER (ORDER BY "createdAt", "id") AS "slug"
  FROM "Problem"
)
UPDATE "Problem"
SET "slug" = numbered_problems."slug"
FROM numbered_problems
WHERE "Problem"."id" = numbered_problems."id";

ALTER TABLE "Problem" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");
