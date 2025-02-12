-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
