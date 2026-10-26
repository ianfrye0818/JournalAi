-- Opt-in, because the recap email contains journal content.
ALTER TABLE "user" ADD COLUMN "monthlyRecap" BOOLEAN NOT NULL DEFAULT false;
