-- Expand phase for server-owned grading.
-- The legacy Test.content column remains until old Cloud Run revisions and
-- legacy API clients have been retired.

ALTER TABLE "Test"
  ADD COLUMN "publicContent" JSONB,
  ADD COLUMN "answerKey" JSONB;

UPDATE "Test"
SET
  "publicContent" = "content" - 'answers',
  "answerKey" = "content" -> 'answers'
WHERE "publicContent" IS NULL;

ALTER TABLE "Attempt"
  ADD COLUMN "gradingDetails" JSONB,
  ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "Attempt_idempotencyKey_key"
  ON "Attempt"("idempotencyKey");

CREATE INDEX "Attempt_userId_createdAt_idx"
  ON "Attempt"("userId", "createdAt");

CREATE INDEX "Attempt_testId_createdAt_idx"
  ON "Attempt"("testId", "createdAt");

CREATE INDEX "Comment_testId_createdAt_idx"
  ON "Comment"("testId", "createdAt");
