-- CreateEnum
CREATE TYPE "RaceTeam" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "RaceCrewAssignment" ADD COLUMN     "raceTeam" "RaceTeam" NOT NULL DEFAULT 'A';
