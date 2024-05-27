import { GetServerSideProps } from 'next';
import React from 'react';
import AssignModal from '@/components/ui/assign-modal';
import { getCrewMembers, getRacesWithHeats } from '@/lib/db';
import { CrewMember, Race, Heat } from '@prisma/client';

type RaceWithHeats = Race & {
  heats: Heat[];
};

type AssignPageProps = {
  crewMembers: CrewMember[];
  racesWithHeats: RaceWithHeats[]
};

const AssignPage: React.FC<AssignPageProps> = ({ crewMembers, racesWithHeats }) => {
  console.log({racesWithHeats})
  const heat = racesWithHeats[0].heats[0]; // default to first heat of first race
  return (
    <div>
      <h1>Assign Crew Members</h1>
      <AssignModal
        heat={heat}
        races={racesWithHeats}
        crewMembers={crewMembers}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { carnivalId } = context.query;
  const racesWithHeats = await getRacesWithHeats(Number(carnivalId));
  const crewMembers = await getCrewMembers(1); // Fetch crew members for the given clubId
  return {
    props: {
      crewMembers,
      racesWithHeats,
    },
  };
};

export default AssignPage;
