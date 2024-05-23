// src/pages/race-day.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getCarnivalById, getRacesForCarnival } from '@/lib/db';
import { Carnival, Race } from '@prisma/client';
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type RaceDayPageProps = {
  carnival: Carnival;
  races: Race[];
};

const RaceDayPage: React.FC<RaceDayPageProps> = ({ carnival, races }) => {
  const [heatStatus, setHeatStatus] = useState<Record<string, string[]>>({});

  const handleHeatCompletion = (raceId: number, heatIndex: number) => {
    setHeatStatus((prevStatus) => {
      const raceStatus = prevStatus[raceId] || [];
      raceStatus[heatIndex] = raceStatus[heatIndex] === 'completed' ? 'waiting' : 'completed';
      return {
        ...prevStatus,
        [raceId]: raceStatus,
      };
    });
  };

  const getHeatStatus = (raceId: number, heatIndex: number) => {
    const raceStatus = heatStatus[raceId] || [];
    return raceStatus[heatIndex] || 'waiting';
  };

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2">
        <div>
          Race Day for {carnival.name} {new Date(carnival.startDate).toLocaleDateString()} - {new Date(carnival.endDate).toLocaleDateString()}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Race</TableHead>
              <TableHead>Through From Heat</TableHead>
              <TableHead>Number of Races</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => (
              <React.Fragment key={race.id}>
                <TableRow>
                  <TableCell>{race.order}</TableCell>
                  <TableCell>{race.description}</TableCell>
                  <TableCell>{race.goThrough}</TableCell>
                  <TableCell>{race.numRaces}</TableCell>
                  <TableCell>{race.round}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {[...Array(race.numRaces)].map((_, index) => (
                  <TableRow key={`${race.id}-heat-${index}`}>
                    <TableCell></TableCell>
                    <TableCell>Heat {index + 1}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <span className={`pill ${getHeatStatus(race.id, index)}`}>
                          {getHeatStatus(race.id, index)}
                        </span>
                      </Badge>

                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={getHeatStatus(race.id, index) === 'completed'}
                        onChange={() => handleHeatCompletion(race.id, index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { carnivalId } = context.query;
  const carnival = await getCarnivalById(Number(carnivalId));
  const races = await getRacesForCarnival(Number(carnivalId));

  const serializedCarnival = {
    ...carnival,
    startDate: carnival.startDate.toISOString(),
    endDate: carnival.endDate.toISOString(),
  };

  return {
    props: {
      carnival: serializedCarnival,
      races,
    },
  };
};

export default RaceDayPage;
