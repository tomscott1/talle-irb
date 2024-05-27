import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { heatId, raceId } = req.body;

    try {
      
        // Set isCurrent to false for all heats in the race
      await prisma.heat.updateMany({
        where: { raceId },
        data: { isCurrent: false },
      });
    
      await prisma.heat.update({
        where: { id: heatId },
        data: { isCompleted: true, isCurrent: false },
      });

      const nextHeat = await prisma.heat.findFirst({
        where: {
          raceId,
          isCompleted: false,
        },
        orderBy: {
          heatNum: 'asc',
        },
      });

      if (nextHeat) {
        await prisma.heat.update({
          where: { id: nextHeat.id },
          data: { isCurrent: true },
        });
      } // else set next race first heat to curent

      res.status(200).json({ message: 'Heat updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating heat', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
