-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('MATH', 'PHYSICS', 'CHEMISTRY');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" STRING;
ALTER TABLE "User" ADD COLUMN     "role" "Role";

-- CreateTable
CREATE TABLE "Question" (
    "id" STRING NOT NULL,
    "subject" "Subject" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "index" INT4 NOT NULL,
    "text" STRING NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" STRING NOT NULL,
    "letter" STRING NOT NULL,
    "text" STRING NOT NULL,
    "subject" "Subject" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "questionId" STRING,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" STRING NOT NULL,
    "index" INT4 NOT NULL,
    "correctOption" STRING NOT NULL,
    "solutionData" STRING NOT NULL,
    "subject" "Subject" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" STRING NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestUser" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "testId" STRING NOT NULL,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAnalytics" (
    "id" STRING NOT NULL,
    "testId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "lastActiveQuestionId" STRING,
    "timeSpent" FLOAT8 NOT NULL,
    "tabSwitches" INT4 NOT NULL,

    CONSTRAINT "TestAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionTime" (
    "id" STRING NOT NULL,
    "testId" STRING NOT NULL,
    "questionId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "timeSpent" FLOAT8 NOT NULL,

    CONSTRAINT "QuestionTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttemptedQuestions" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_SkippedQuestions" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_MarkedQuestions" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_index_subject_difficulty_key" ON "Question"("index", "subject", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_index_subject_difficulty_key" ON "Answer"("index", "subject", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionTime_testId_questionId_userId_key" ON "QuestionTime"("testId", "questionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_AttemptedQuestions_AB_unique" ON "_AttemptedQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_AttemptedQuestions_B_index" ON "_AttemptedQuestions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkippedQuestions_AB_unique" ON "_SkippedQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_SkippedQuestions_B_index" ON "_SkippedQuestions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MarkedQuestions_AB_unique" ON "_MarkedQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_MarkedQuestions_B_index" ON "_MarkedQuestions"("B");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_index_subject_difficulty_fkey" FOREIGN KEY ("index", "subject", "difficulty") REFERENCES "Question"("index", "subject", "difficulty") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUser" ADD CONSTRAINT "TestUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUser" ADD CONSTRAINT "TestUser_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnalytics" ADD CONSTRAINT "TestAnalytics_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnalytics" ADD CONSTRAINT "TestAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnalytics" ADD CONSTRAINT "TestAnalytics_lastActiveQuestionId_fkey" FOREIGN KEY ("lastActiveQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTime" ADD CONSTRAINT "QuestionTime_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTime" ADD CONSTRAINT "QuestionTime_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTime" ADD CONSTRAINT "QuestionTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttemptedQuestions" ADD CONSTRAINT "_AttemptedQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttemptedQuestions" ADD CONSTRAINT "_AttemptedQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "TestAnalytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkippedQuestions" ADD CONSTRAINT "_SkippedQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkippedQuestions" ADD CONSTRAINT "_SkippedQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "TestAnalytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarkedQuestions" ADD CONSTRAINT "_MarkedQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarkedQuestions" ADD CONSTRAINT "_MarkedQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "TestAnalytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
