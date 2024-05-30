/*
  Warnings:

  - You are about to drop the `Carnival` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrewMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Heat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Race` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RaceCrewAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CrewMember" DROP CONSTRAINT "CrewMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Heat" DROP CONSTRAINT "Heat_raceId_fkey";

-- DropForeignKey
ALTER TABLE "Race" DROP CONSTRAINT "Race_carnivalId_fkey";

-- DropForeignKey
ALTER TABLE "RaceCrewAssignment" DROP CONSTRAINT "RaceCrewAssignment_crewMemberId_fkey";

-- DropForeignKey
ALTER TABLE "RaceCrewAssignment" DROP CONSTRAINT "RaceCrewAssignment_raceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubId_fkey";

-- DropTable
DROP TABLE "Carnival";

-- DropTable
DROP TABLE "Club";

-- DropTable
DROP TABLE "CrewMember";

-- DropTable
DROP TABLE "Heat";

-- DropTable
DROP TABLE "Race";

-- DropTable
DROP TABLE "RaceCrewAssignment";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carnival" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carnival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDriver" BOOLEAN NOT NULL,
    "clubId" INTEGER NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race" (
    "id" SERIAL NOT NULL,
    "carnivalId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "goThrough" INTEGER NOT NULL,
    "numRaces" INTEGER NOT NULL,
    "currentHeatNum" INTEGER NOT NULL DEFAULT 1,
    "round" "Round" NOT NULL,
    "raceCrewType" "RaceCrewType" NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_crew_assignment" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "crewMemberId" INTEGER NOT NULL,
    "role" "CrewRole" NOT NULL,
    "heat" INTEGER NOT NULL DEFAULT 1,
    "raceTeam" "RaceTeam" NOT NULL DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "race_crew_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heat" (
    "id" SERIAL NOT NULL,
    "heatNum" INTEGER NOT NULL,
    "result" INTEGER,
    "raceId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "race_crew_assignment_raceId_crewMemberId_role_key" ON "race_crew_assignment"("raceId", "crewMemberId", "role");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_member" ADD CONSTRAINT "crew_member_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race" ADD CONSTRAINT "race_carnivalId_fkey" FOREIGN KEY ("carnivalId") REFERENCES "carnival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_crew_assignment" ADD CONSTRAINT "race_crew_assignment_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_crew_assignment" ADD CONSTRAINT "race_crew_assignment_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "crew_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heat" ADD CONSTRAINT "heat_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
