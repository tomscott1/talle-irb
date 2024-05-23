// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function getRacesForCarnival(carnivalId: number) {
  return await prisma.race.findMany({
    where: {
      carnivalId,
    },
    select: {
      id: true,
      description: true,
      order: true,
      goThrough: true,
      numRaces: true,
      round: true,
    },
  });
}
