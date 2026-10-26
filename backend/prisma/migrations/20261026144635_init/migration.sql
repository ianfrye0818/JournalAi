-- CreateTable
CREATE TABLE "snippet" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'text',
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "snippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_session" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "daily_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "answer" TEXT,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "aiDraft" TEXT NOT NULL,
    "flags" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleProfile" (
    "id" TEXT NOT NULL,
    "samples" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "StyleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "snippet_clientId_key" ON "snippet"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_session_date_key" ON "daily_session"("date");

-- CreateIndex
CREATE UNIQUE INDEX "question_sessionId_key" ON "question"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_sessionId_key" ON "Entry"("sessionId");

-- AddForeignKey
ALTER TABLE "snippet" ADD CONSTRAINT "snippet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "daily_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "daily_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "daily_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
