import React from 'react';
import { Race, Heat, CrewMember } from '@prisma/client';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignModal from './assign-modal';

type RaceWithHeats = Race & {
  heats: Heat[];
};

type RaceTableProps = {
  race: RaceWithHeats;
  setRaces: React.Dispatch<React.SetStateAction<RaceWithHeats[]>>;
  crewMembers: CrewMember[];
};

const RaceTable: React.FC<RaceTableProps> = ({ race, setRaces, crewMembers }) => {
  const handleMarkComplete = async (heatId: number) => {
    try {
      const response = await fetch('/api/update-heat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heatId, raceId: race.id }),
      });

      if (response.ok) {
        setRaces(prevRaces => {
          return prevRaces.map(r => {
            if (r.id === race.id) {
              const updatedHeats = r.heats.map(h => {
                if (h.id === heatId) {
                  return { ...h, isCompleted: true, isCurrent: false };
                }
                return h;
              });

              const nextHeat = updatedHeats.find(h => !h.isCompleted);

              if (nextHeat) {
                nextHeat.isCurrent = true;
              }

              return {
                ...r,
                heats: updatedHeats,
              };
            }
            return r;
          });
        });

        toast('Heat marked as complete');

        toast.info('Heat marked as complete!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
            });
      } else {
        toast.error('Failed to update heat status', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
            });
      }
    } catch (error) {
      console.error('Error updating heat status:', error);
    }
  };

  const handleAssign = async (heatId: number) => {
    console.log('assign here')
    // try {
    //   const response = await fetch('/api/assign-heat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify
  };

  const sortedHeats = [...race.heats].sort((a, b) => a.heatNum - b.heatNum); // let's sort the heats by heatNum

  return (
    <div>
      <Table>
        <TableBody>
          {sortedHeats.map((heat, index) => (
            <React.Fragment key={heat.id}>
              <TableRow key={heat.id}>
                <TableCell>Heat {index + 1} - {race.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {heat.isCurrent ? 'Current' : heat.isCompleted ? 'Completed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {heat.isCurrent ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleMarkComplete(heat.id)}
                    >
                      Mark As Complete
                    </Button>
                  ) : !heat.isCompleted ? (
                    <AssignModal
                      races={[race]}
                      heat={heat}
                      crewMembers={crewMembers}
                    />
                  ) : null }
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default RaceTable;
