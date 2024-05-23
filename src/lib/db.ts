// src/lib/db.ts
import { prisma } from './prisma';

export async function getCarnivals() {
  return await prisma.carnival.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function getCarnivalById(id: number) {
  return await prisma.carnival.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
    },
  });
}

// Fetch all crew members
export async function getCrewMembers() {
  return await prisma.crewMember.findMany({
    select: {
      id: true,
      name: true,
      isDriver: true,
      // photo: true,
    },
  });
}

// Fetch all races for a given carnival
export async function getRacesForCarnival(carnivalId: number) {
  return await prisma.race.findMany({
    where: { carnivalId },
    select: {
      id: true,
      description: true,
      order: true,
      goThrough: true,
      numRaces: true,
      currentHeatNum: true,
      round: true,
      isCompleted: true,
    },
  });
}

// Fetch all crew assignments for a given race
export async function getCrewAssignmentsForRace(raceId: number) {
  return await prisma.raceCrewAssignment.findMany({
    where: { raceId },
    select: {
      id: true,
      raceId: true,
      crewMemberId: true,
      role: true,
      heat: true,
    },
  });
}

// Create or update a crew assignment
export async function createOrUpdateCrewAssignment(
  raceId: number,
  crewMemberId: number,
  role: string,
  heat: number
) {
  return await prisma.raceCrewAssignment.upsert({
    where: {
      raceId_crewMemberId_role: {
        raceId,
        crewMemberId,
        role,
      },
    },
    update: { heat },
    create: {
      raceId,
      crewMemberId,
      role,
      heat,
    },
  });
}
