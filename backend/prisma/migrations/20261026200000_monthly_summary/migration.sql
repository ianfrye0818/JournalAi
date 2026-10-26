CREATE TABLE "monthly_summary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "subject" TEXT,
    "text" TEXT,
    "html" TEXT,
    "sentAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    CONSTRAINT "monthly_summary_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "monthly_summary_userId_month_key" ON "monthly_summary"("userId", "month");
ALTER TABLE "monthly_summary" ADD CONSTRAINT "monthly_summary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
