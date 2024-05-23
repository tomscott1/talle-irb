-- AlterTable
ALTER TABLE "CrewMember" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RaceCrewAssignment" ALTER COLUMN "heat" SET DEFAULT 1;
