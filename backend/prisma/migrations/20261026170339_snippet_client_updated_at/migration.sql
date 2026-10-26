-- AlterTable: backfill existing rows from updatedAt, then require the column.
ALTER TABLE "snippet" ADD COLUMN "clientUpdatedAt" TIMESTAMP(3);
UPDATE "snippet" SET "clientUpdatedAt" = "updatedAt";
ALTER TABLE "snippet" ALTER COLUMN "clientUpdatedAt" SET NOT NULL;
