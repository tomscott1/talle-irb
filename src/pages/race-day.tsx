// src/pages/race-day.tsx
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import {
    getCarnivalById,
    getRacesForCarnival,
    getRacesWithHeats,
    getCrewMembers,
    getAllCrewAssignments,
} from '@/lib/db';
import {
  Carnival,
  Race, Heat,
  CrewMember,
  RaceCrewAssignment,
} from '@prisma/client';
import RaceTable from '@/components/ui/race-table';

// Define RaceWithHeats type locally
type RaceWithHeats = Race & {
  heats: Heat[];
};

type RaceDayPageProps = {
  carnival: Carnival;
  racesWithHeats: RaceWithHeats[];
  crewMembers: CrewMember[];
  assignments: RaceCrewAssignment[];
};

const RaceDayPage: React.FC<RaceDayPageProps> = ({
  carnival,
  racesWithHeats,
  crewMembers,
  assignments,
}) => {
  const [races, setRaces] = useState<RaceWithHeats[]>(racesWithHeats);

  const racesWithCurrent = races.map(race => {
    const isCurrent = race.heats.some(heat => heat.isCurrent);
    const assignedHeats = race.heats.map(heat => {
      const isAssigned = assignments.some(
        assignment => assignment.raceId === race.id && assignment.heat === heat.heatNum
      );
      if(isAssigned) return { ...heat, isAssigned };
    }).filter(Boolean);
    return { ...race, isCurrent, assignedHeats };
  }).sort((a, b) => a.order - b.order);

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2">
        <div>
          Race Day for {carnival.name} {new Date(carnival.startDate).toLocaleDateString()} - {new Date(carnival.endDate).toLocaleDateString()}
        </div>
        {racesWithCurrent.map((race) => (
          <React.Fragment key={race.id}>
            <div className="text-center">
              {race.round} - {race.description} - {race.isCurrent ? 'In Progress' : 'Coming Up'}
            </div>
            <RaceTable
              race={race}
              setRaces={setRaces}
              crewMembers={crewMembers}
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
  const crewMembers = await getCrewMembers(1); // Fetch crew members for the given clubId
  const assignments = await getAllCrewAssignments(Number(carnivalId));

  const serializedCarnival = {
    ...carnival,
    startDate: carnival.startDate?.toISOString(),
    endDate: carnival.endDate?.toISOString(),
  };

  return {
    props: {
      carnival: serializedCarnival,
      racesWithHeats,
      crewMembers,
      assignments,
    },
  };
};

export default RaceDayPage;
