// src/pages/assign-page.tsx
import { GetServerSideProps } from 'next';
import React from 'react';
import AssignModal from '@/components/ui/assign-modal';
import { getCrewMembers } from '@/lib/db';
import { CrewMember } from '@prisma/client';

type AssignPageProps = {
  crewMembers: CrewMember[];
};

const AssignPage: React.FC<AssignPageProps> = ({ crewMembers }) => {
  return (
    <div>
      <h1>Assign Crew Members</h1>
      <AssignModal heatId={1} crewMembers={crewMembers} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const crewMembers = await getCrewMembers(1); // Fetch crew members for the given clubId
  return {
    props: {
      crewMembers,
    },
  };
};

export default AssignPage;
