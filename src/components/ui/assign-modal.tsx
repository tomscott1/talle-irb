// src/components/assign-modal.tsx
import React, { useState, useEffect } from 'react';
import { CrewMember, Race, Heat } from '@prisma/client'; // Include Heat in the import
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AssignModalProps = {
  heat: Heat;
  races: Race[];
  crewMembers: CrewMember[];
};

const AssignModal: React.FC<AssignModalProps> = ({ heat, races, crewMembers }) => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(races[0]);
  const [selectedHeat, setSelectedHeat] = useState<Heat | null>(heat);

  useEffect(() => {
    if (races.length === 1) {
      setSelectedRace(races[0]);
    }
  }, [races]);

  useEffect(() => {
    if (selectedRace && selectedRace.heats && selectedRace.heats.length > 0) {
      setSelectedHeat(selectedRace.heats.find(h => h.id === heat.id) || selectedRace.heats[0]);
    } else {
      setSelectedHeat(null);
    }
  }, [selectedRace, heat]);

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div>
              <Select
                value={selectedRace?.description || ''}
                onValueChange={(value) => {
                  const race = races.find(r => r.description === value);
                  setSelectedRace(race || null);
                }}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="select a race" />
                </SelectTrigger>
                <SelectContent>
                  {races.map((race) => (
                    <SelectItem key={race.id} value={race.description}>
                      {race.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedRace && selectedRace.heats && selectedRace.heats.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div>
                <Select
                  value={selectedHeat?.heatNum.toString() || ''}
                  onValueChange={(value) => {
                    const heat = selectedRace.heats.find(h => h.heatNum.toString() === value);
                    setSelectedHeat(heat || null);
                  }}
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="select a heat" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedRace.heats.map((heat) => (
                      <SelectItem key={heat.id} value={heat.heatNum.toString()}>
                        Heat {heat.heatNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
