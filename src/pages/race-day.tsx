// src/pages/race-day.tsx
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { getCarnivalById, getRacesForCarnival, getRacesWithHeats } from '@/lib/db';
import { Carnival, Race, Heat } from '@prisma/client';
import RaceTable from '@/components/ui/race-table';

// Define RaceWithHeats type locally
type RaceWithHeats = Race & {
  heats: Heat[];
};

type RaceDayPageProps = {
  carnival: Carnival;
  racesWithHeats: RaceWithHeats[];
};

const RaceDayPage: React.FC<RaceDayPageProps> = ({ carnival, racesWithHeats }) => {
  const [races, setRaces] = useState<RaceWithHeats[]>(racesWithHeats);

  const racesWithCurrent = races.map(race => {
    const isCurrent = race.heats.some(heat => heat.isCurrent);
    return { ...race, isCurrent };
  });

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2">
        <div>
          Race Day for {carnival.name} {new Date(carnival.startDate).toLocaleDateString()} - {new Date(carnival.endDate).toLocaleDateString()}
        </div>
        {racesWithCurrent.map((race) => (
          <React.Fragment key={race.id}>
            {race.round} - {race.description} - {race.isCurrent ? 'In Progress' : 'Coming Up'}
            <RaceTable
              race={race}
              setRaces={setRaces}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { carnivalId } = context.query;
  const carnival = await getCarnivalById(Number(carnivalId));
  const racesWithHeats = await getRacesWithHeats(Number(carnivalId));

  const serializedCarnival = {
    ...carnival,
    startDate: carnival.startDate?.toISOString(),
    endDate: carnival.endDate?.toISOString(),
  };

  return {
    props: {
      carnival: serializedCarnival,
      racesWithHeats,
    },
  };
};

export default RaceDayPage;
