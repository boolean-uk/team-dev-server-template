UPDATE "Post"
SET "createdAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL;

UPDATE "Post"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;