// src/components/assign-modal.tsx
import React from 'react';
import { CrewMember, Race } from '@prisma/client';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AssignModalProps = {
  heatId: number,
  race: Race,
  crewMembers: CrewMember[];
};

const AssignModal: React.FC<AssignModalProps> = ({ heatId, race, crewMembers }) => {
  console.log({ heatId, crewMembers });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Crew</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
          <DialogDescription>
            Add Crew Members to the heat for this race.
          </DialogDescription>
        </DialogHeader>

        {/* Add your form fields and logic here */}
        
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
