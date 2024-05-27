-- CreateEnum
CREATE TYPE "RaceCrewType" AS ENUM ('STANDARD', 'EXTRAPATIENT', 'EXTRACREW');

-- AlterTable
ALTER TABLE "CrewMember" ADD COLUMN     "clubId" INTEGER;

-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "raceCrewType" "RaceCrewType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clubId" INTEGER;

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
