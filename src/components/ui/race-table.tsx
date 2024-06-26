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

type AssignedHeats = {
  heatNum: number;
  raceId: number;
}

type RaceWithHeats = Race & {
  heats: Heat[];
  assignedHeats: AssignedHeats[];
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
        console.log({response})
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

        console.log('heat marked as complete')

      } else {
        console.error('Failed to update heat status')
      }
    } catch (error) {
      console.error('Error updating heat status:', error);
    }
  };

  const isAssigned = (heat: Heat) => {
    console.log({heat})
    console.log({race})
    return race.assignedHeats.some(assignedHeat => assignedHeat.heatNum === heat.heatNum)
  };


  const sortedHeats = [...race.heats].sort((a, b) => a.heatNum - b.heatNum); // let's sort the heats by heatNum

  const getHeatStatus = (heat: Heat) => {
    if (heat.isCurrent) return 'Current';
    if (heat.isCompleted) return 'Completed';
  
    const heatPosition = heat.heatNum - race.currentHeatNum;
  
    if (heatPosition === 1) return 'Next Heat';
    if (heatPosition > 1 && heatPosition <= 10) return `Pending ${heatPosition} Heats`;
  
    return 'Pending';
  };


  return (
    <div>
      <Table>
        <TableHeader className='sr-only'>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHeats.map((heat, index) => (
            <React.Fragment key={heat.id}>
              <TableRow key={heat.id} className={`${isAssigned(heat) ? 'bg-sky-200' : ''}`}>
                <TableCell className="w-1/3">Heat {index + 1} - {race.description}</TableCell>
                <TableCell className="w-1/3 text-center">
                <Badge className={`w-1/8 ${heat.isCurrent ? 'bg-blue-400 text-white' : heat.isCompleted ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                  {/* <Badge variant="secondary"> */}
                    {getHeatStatus(heat)}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end">
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
    </div>
  );
};

export default RaceTable;
