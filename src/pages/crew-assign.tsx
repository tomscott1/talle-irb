import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useCarnivalStore } from '@/store/carnival-store';
import { getCrewMembers, createOrUpdateCrewAssignment } from '@/lib/db';
import { CrewMember, Race } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import LikePage from '@/components/ui/likes';

type CrewAssignPageProps = {
  crewMembers: CrewMember[];
};

const CrewAssignPage: React.FC<CrewAssignPageProps> = ({ crewMembers }) => {
  const activeCarnival = useCarnivalStore((state) => state.activeCarnival);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedCrewie, setSelectedCrewie] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [includeRelay, setIncludeRelay] = useState(false);
  const [extraPatient, setExtraPatient] = useState(false);
  const [canSave, setCanSave] = useState(true);

  useEffect(() => {
    if (activeCarnival) {
      fetch(`/api/get-races?carnivalId=${activeCarnival.id}`)
        .then((response) => response.json())
        .then((data) => {
          setRaces(data);
        })
        .catch((error) => console.error('Error fetching races:', error));
    }
  }, [activeCarnival]);

  useEffect(() => {
    setCanSave(!!selectedRace && !!selectedDriver && !!selectedCrewie && !!selectedPatient);
  }, [selectedRace, selectedDriver, selectedCrewie, selectedPatient]);

  const handleAssignCrew = async (role: 'DRIVER' | 'CREWIE' | 'PATIENT', crewMemberId: string) => { // Change to string
    if (!selectedRace) return;
    await createOrUpdateCrewAssignment(parseInt(selectedRace), parseInt(crewMemberId), role, 1); // Parse the string to number
  }

  const handleSaveAssignments = async () => {
    if (!selectedRace || !selectedDriver || !selectedCrewie || !selectedPatient) {
      alert('Please select a race, driver, crewie, and patient.');
      return;
    }

    const assignments = [
      { role: 'DRIVER', crewMemberId: parseInt(selectedDriver) }, // Parse the string to number
      { role: 'CREWIE', crewMemberId: parseInt(selectedCrewie) }, // Parse the string to number
      { role: 'PATIENT', crewMemberId: parseInt(selectedPatient) }, // Parse the string to number
    ];

    if (includeRelay) {
      // Add additional assignments for relay if includeRelay is true
    }

    if (extraPatient) {
      assignments.push({ role: 'PATIENT', crewMemberId: parseInt(selectedPatient) }); // Parse the string to number
    }

    try {
      const response = await fetch('/api/save-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId: parseInt(selectedRace), 
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

  let selectedMembers = [selectedDriver, selectedCrewie, selectedPatient].filter(Boolean);
  const filterCrewMembers = (members: CrewMember[], selectedMembers: (number | null)[]) => {
    return members.filter(member => !selectedMembers.includes(member.id));
  };

  let availableDrivers = filterCrewMembers(crewMembers.filter(member => member.isDriver), selectedMembers);
  let availableCrewMembers = filterCrewMembers(crewMembers, selectedMembers);

  const updateAvailableCrewMembers = () => {
    availableDrivers = filterCrewMembers(crewMembers.filter(member => member.isDriver), selectedMembers);
    availableCrewMembers = filterCrewMembers(crewMembers, selectedMembers);
  };

  const updateState = () => {
    updateAvailableCrewMembers();
  };



  if (!activeCarnival) {
    return (
      <div className="flex flex-col items-center">
        <h1>Please select a carnival from the <Link href="/carnivals">Carnivals</Link> page.</h1>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1 className="mb-4">Crew Assignments for {activeCarnival.name}</h1>
        <div className="grid grid-cols-6 gap-4">
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="select a race" />
              </SelectTrigger>
              <SelectContent>
                {races.map((race) => (
                  <SelectItem key={race.id} value={race.description} onSelect={() => setSelectedRace(race)}>
                    {race.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="mb-2">
              <Select value={selectedDriver ?? ''} onValueChange={setSelectedDriver}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id.toString()} onSelect={() => setSelectedDriver(driver.id.toString())}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {includeRelay ? (
              <div className="mb-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.name} onSelect={() => setSelectedDriver(driver.id)}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select a crewie" />
                </SelectTrigger>
                <SelectContent>
                  {availableCrewMembers.map((crewie) => (
                    <SelectItem key={crewie.id} value={crewie.name} onSelect={() => setSelectedCrewie(crewie.id)}>
                      {crewie.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {includeRelay ? (
              <div className="mb-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select a crewie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCrewMembers.map((crewie) => (
                      <SelectItem key={crewie.id} value={crewie.name} onSelect={() => setSelectedCrewie(crewie.id)}>
                        {crewie.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {availableCrewMembers.map((patient) => (
                    <SelectItem key={patient.id} value={patient.name} onSelect={() => setSelectedPatient(patient.id)}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {extraPatient || includeRelay ? (
              <div className="mb-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCrewMembers.map((patient) => (
                      <SelectItem key={patient.id} value={patient.name} onSelect={() => setSelectedPatient(patient.id)}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center space-x-2 ml-4">
            <Button onClick={() => setIncludeRelay(true)}>Add Crew</Button>
          </div>
          <div>
            <Button onClick={() => setExtraPatient(true)}>Add Patient</Button>
          </div>
        </div>

        <Button className="mt-4" onClick={handleSaveAssignments} disabled={!canSave}>
          Save Assignments
        </Button>
        <div>
          <LikePage />
        </div>
      </div>
    );
  };
}

export const getServerSideProps: GetServerSideProps = async () => {
  const crewMembers = await getCrewMembers();
  return {
    props: {
      crewMembers,
    },
  };
};

export default CrewAssignPage;
