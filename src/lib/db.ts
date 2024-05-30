// src/lib/db.ts
import { prisma } from './prisma';
import { CrewRole } from './types/enums';

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
export async function getCrewMembers(clubId: number) {
  return await prisma.crewMember.findMany({
    where: { clubId },
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
      raceCrewType: true,
    },
  });
}

// get races with corresponding heats
export async function getRacesWithHeats(carnivalId: number) {
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
      raceCrewType: true,
      heats: {
        select: {
          id: true,
          raceId: true,
          heatNum: true,
          isCompleted: true,
          isCurrent: true,
        },
      },
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

// fetch crew assignemnts for a given raceId/heat
export async function getSpecificCrewAssignments(raceId: number, heat: number) {
  return await prisma.raceCrewAssignment.findMany({
    where: { raceId, heat },
    select: {
      id: true,
      raceId: true,
      crewMemberId: true,
      role: true,
      heat: true,
    },
  });
}

// fetch all crew assignments for a given crew member
export async function getCrewAssignmentsForCrewMember(crewMemberId: number) {
  return await prisma.raceCrewAssignment.findMany({
    where: { crewMemberId },
    select: {
      id: true,
      raceId: true,
      crewMemberId: true,
      role: true,
      heat: true,
    },
  });
}

// fetch all crew assignments
// TODO: scope this to a club
export async function getAllCrewAssignments(carnivalId: number) {
  return await prisma.raceCrewAssignment.findMany({
    where: {
      race: {
        carnivalId,
      },
    },
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
  role: CrewRole,
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