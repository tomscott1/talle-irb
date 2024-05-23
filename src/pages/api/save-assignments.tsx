import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { raceId, assignments } = req.body;

    try {
      const createAssignments = assignments.map((assignment: any) => 
        prisma.raceCrewAssignment.create({
          data: {
            raceId,
            crewMemberId: assignment.crewMemberId,
            role: assignment.role,
            heat: 1, // Assuming heat is always 1 for simplicity
          },
        })
      );

      await Promise.all(createAssignments);

      res.status(200).json({ message: 'Assignments saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving assignments' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
