// src/pages/api/carnivals.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const carnivals = await prisma.carnival.findMany();
      res.status(200).json(carnivals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching carnivals', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
