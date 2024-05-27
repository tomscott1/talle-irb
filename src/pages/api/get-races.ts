// src/pages/api/get-races.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { carnivalId } = req.query;

  if (!carnivalId || Array.isArray(carnivalId)) {
    return res.status(400).json({ message: 'Invalid carnival ID' });
  }

  try {
    const races = await prisma.race.findMany({
      where: { carnivalId: Number(carnivalId) },
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

    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
