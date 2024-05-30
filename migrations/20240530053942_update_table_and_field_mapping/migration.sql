/*
  Warnings:

  - You are about to drop the column `createdAt` on the `carnival` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `carnival` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `carnival` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `carnival` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `club` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `club` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `crew_member` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `crew_member` table. All the data in the column will be lost.
  - You are about to drop the column `isDriver` on the `crew_member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `crew_member` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `heatNum` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `isCurrent` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `raceId` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `heat` table. All the data in the column will be lost.
  - You are about to drop the column `carnivalId` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `currentHeatNum` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `goThrough` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `numRaces` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `raceCrewType` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `race` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `race_crew_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `crewMemberId` on the `race_crew_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `raceId` on the `race_crew_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `raceTeam` on the `race_crew_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `race_crew_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[race_id,crew_member_id,role]` on the table `race_crew_assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_date` to the `carnival` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `carnival` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `crew_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_driver` to the `crew_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heat_num` to the `heat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race_id` to the `heat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carnival_id` to the `race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `go_through` to the `race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_completed` to the `race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_races` to the `race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race_crew_type` to the `race` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `round` on the `race` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `crew_member_id` to the `race_crew_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race_id` to the `race_crew_assignment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `race_crew_assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `club_id` to the `user` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "round" AS ENUM ('ROUND1', 'ROUND2', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "crew_role" AS ENUM ('DRIVER', 'CREWIE', 'PATIENT');

-- CreateEnum
CREATE TYPE "race_team" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "race_crew_type" AS ENUM ('STANDARD', 'EXTRAPATIENT', 'EXTRACREW');

-- DropForeignKey
ALTER TABLE "crew_member" DROP CONSTRAINT "crew_member_clubId_fkey";

-- DropForeignKey
ALTER TABLE "heat" DROP CONSTRAINT "heat_raceId_fkey";

-- DropForeignKey
ALTER TABLE "race" DROP CONSTRAINT "race_carnivalId_fkey";

-- DropForeignKey
ALTER TABLE "race_crew_assignment" DROP CONSTRAINT "race_crew_assignment_crewMemberId_fkey";

-- DropForeignKey
ALTER TABLE "race_crew_assignment" DROP CONSTRAINT "race_crew_assignment_raceId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_clubId_fkey";

-- DropIndex
DROP INDEX "race_crew_assignment_raceId_crewMemberId_role_key";

-- AlterTable
ALTER TABLE "carnival" DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "club" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "crew_member" DROP COLUMN "clubId",
DROP COLUMN "createdAt",
DROP COLUMN "isDriver",
DROP COLUMN "updatedAt",
ADD COLUMN     "club_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_driver" BOOLEAN NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "heat" DROP COLUMN "createdAt",
DROP COLUMN "heatNum",
DROP COLUMN "isCompleted",
DROP COLUMN "isCurrent",
DROP COLUMN "raceId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "heat_num" INTEGER NOT NULL,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "race_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "race" DROP COLUMN "carnivalId",
DROP COLUMN "createdAt",
DROP COLUMN "currentHeatNum",
DROP COLUMN "goThrough",
DROP COLUMN "isCompleted",
DROP COLUMN "numRaces",
DROP COLUMN "raceCrewType",
DROP COLUMN "updatedAt",
ADD COLUMN     "carnival_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_heat_num" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "go_through" INTEGER NOT NULL,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL,
ADD COLUMN     "num_races" INTEGER NOT NULL,
ADD COLUMN     "race_crew_type" "race_crew_type" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "round",
ADD COLUMN     "round" "round" NOT NULL;

-- AlterTable
ALTER TABLE "race_crew_assignment" DROP COLUMN "createdAt",
DROP COLUMN "crewMemberId",
DROP COLUMN "raceId",
DROP COLUMN "raceTeam",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "crew_member_id" INTEGER NOT NULL,
ADD COLUMN     "race_id" INTEGER NOT NULL,
ADD COLUMN     "race_team" "race_team" NOT NULL DEFAULT 'A',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "crew_role" NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "clubId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "club_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL;

-- DropEnum
DROP TYPE "CrewRole";

-- DropEnum
DROP TYPE "RaceCrewType";

-- DropEnum
DROP TYPE "RaceTeam";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Round";

-- CreateIndex
CREATE UNIQUE INDEX "race_crew_assignment_race_id_crew_member_id_role_key" ON "race_crew_assignment"("race_id", "crew_member_id", "role");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_member" ADD CONSTRAINT "crew_member_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race" ADD CONSTRAINT "race_carnival_id_fkey" FOREIGN KEY ("carnival_id") REFERENCES "carnival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_crew_assignment" ADD CONSTRAINT "race_crew_assignment_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_crew_assignment" ADD CONSTRAINT "race_crew_assignment_crew_member_id_fkey" FOREIGN KEY ("crew_member_id") REFERENCES "crew_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heat" ADD CONSTRAINT "heat_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
