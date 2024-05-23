/*
  Warnings:

  - Added the required column `heat` to the `RaceCrewAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "currentHeatNum" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "RaceCrewAssignment" ADD COLUMN     "heat" INTEGER NOT NULL;
