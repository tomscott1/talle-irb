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
import { Label } from "@/components/ui/label" 
// import { useRouter } from 'next/router';

type RaceWithHeats = Race & {
  heats: Heat[];
};

type AssignModalProps = {
  heat: Heat;
  races: RaceWithHeats[];
  crewMembers: CrewMember[];
};
const AssignModal: React.FC<AssignModalProps> = ({ heat, races, crewMembers }) => {
  // const router = useRouter();
  const [selectedRace, setSelectedRace] = useState<RaceWithHeats | null>(races[0]);
  const [selectedHeat, setSelectedHeat] = useState<Heat | null>(heat);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [selectedCrewie, setSelectedCrewie] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

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

  // Filter crew members based on selection
  const filteredDrivers = crewMembers.filter(
    (member) => member.isDriver && member.id !== selectedCrewie && member.id !== selectedPatient
  );
  const filteredCrewies = crewMembers.filter(
    (member) => member.id !== selectedDriver && member.id !== selectedPatient
  );
  const filteredPatients = crewMembers.filter(
    (member) => member.id !== selectedDriver && member.id !== selectedCrewie
  );

  const includeRelay = false;
  const extraPatient = false;

  const handleSaveAssignments = async () => {
    console.log('saving....')
    if (!selectedRace || !selectedDriver || !selectedCrewie || !selectedPatient) {
      alert('Please select a race, driver, crewie, and patient.');
      return;
    }

    const assignments = [
      { role: 'DRIVER', crewMemberId: selectedDriver }, 
      { role: 'CREWIE', crewMemberId: selectedCrewie }, 
      { role: 'PATIENT', crewMemberId: selectedPatient }, 
    ];

    if (includeRelay) {
      // Add additional assignments for relay if includeRelay is true
    }

    if (extraPatient) {
      // assignments.push({ role: 'PATIENT', crewMemberId: parseInt(selectedPatient) }); // Parse the string to number
    }

    try {
      const response = await fetch('/api/save-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId: selectedRace.id,
          heat: selectedHeat?.heatNum, 
          assignments,
        }),
      });

      if (response.ok) {
        alert('Assignments saved successfully');
      } else {
        alert('Failed to save assignments');
      }
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  };



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Crew</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
          <DialogDescription>
            Add Crew Members to the heat for this race.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label>Race: </Label>
          <Select
            value={selectedRace?.description || ''}
            onValueChange={(value) => {
              const race = races.find(r => r.description === value);
              setSelectedRace(race || null);
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a Race" />
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

        {selectedRace && selectedRace.heats && selectedRace.heats.length > 0 && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Heat: </Label>
            <Select
              value={selectedHeat?.heatNum.toString() || ''}
              onValueChange={(value) => {
                const heat = selectedRace.heats.find(h => h.heatNum.toString() === value);
                setSelectedHeat(heat || null);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a Heat" />
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
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label>{includeRelay ? 'First Driver:' : 'Driver:'}</Label>
          <Select value={selectedDriver?.toString() ?? ''} onValueChange={(value) => setSelectedDriver(Number(value))}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a Driver" />
            </SelectTrigger>
            <SelectContent>
              {filteredDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id.toString()}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label>{includeRelay ? 'First Crewie:' : 'Crewie:'}</Label>
          <Select value={selectedCrewie?.toString() ?? ''} onValueChange={(value) => setSelectedCrewie(Number(value))}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a Crewie" />
            </SelectTrigger>
            <SelectContent>
              {filteredCrewies.map((crewie) => (
                <SelectItem key={crewie.id} value={crewie.id.toString()}>
                  {crewie.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
        <Label>{includeRelay || extraPatient ? 'First Patient:' : 'Patient:'}</Label>
          <Select value={selectedPatient?.toString() ?? ''} onValueChange={(value) => setSelectedPatient(Number(value))}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a Patient" />
            </SelectTrigger>
            <SelectContent>
              {filteredPatients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id.toString()}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {includeRelay ? (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Second Driver: </Label>
            <Select value={selectedDriver?.toString() ?? ''} onValueChange={(value) => setSelectedDriver(Number(value))}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a Driver" />
              </SelectTrigger>
              <SelectContent>
                {filteredDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id.toString()}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {includeRelay ? (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Second Crewie: </Label>
            <Select value={selectedCrewie?.toString() ?? ''} onValueChange={(value) => setSelectedCrewie(Number(value))}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a Crewie" />
              </SelectTrigger>
              <SelectContent>
                {filteredCrewies.map((crewie) => (
                  <SelectItem key={crewie.id} value={crewie.id.toString()}>
                    {crewie.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {extraPatient || includeRelay ? (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Second Patient: </Label>
            <Select value={selectedPatient?.toString() ?? ''} onValueChange={(value) => setSelectedPatient(Number(value))}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a Patient" />
              </SelectTrigger>
              <SelectContent>
                {filteredPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        
        <DialogFooter>
          <Button type="button" onClick={handleSaveAssignments}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
