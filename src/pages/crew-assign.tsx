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

type CrewAssignPageProps = {
  crewMembers: CrewMember[];
};

const CrewAssignPage: React.FC<CrewAssignPageProps> = ({ crewMembers }) => {
  const activeCarnival = useCarnivalStore((state) => state.activeCarnival);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [selectedCrewie, setSelectedCrewie] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [includeRelay, setIncludeRelay] = useState(false);
  const [extraPatient, setExtraPatient] = useState(false);

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

  const handleAssignCrew = async (role: 'DRIVER' | 'CREWIE' | 'PATIENT', crewMemberId: number) => {
    if (!selectedRace) return;
    await createOrUpdateCrewAssignment(selectedRace.id, crewMemberId, role, 1);
  };

  const handleSaveAssignments = async () => {
    console.log('saving assignments....')
    if (!selectedRace) return;
    const assignments = [
      { role: 'DRIVER', crewMemberId: selectedDriver },
      { role: 'CREWIE', crewMemberId: selectedCrewie },
      { role: 'PATIENT', crewMemberId: selectedPatient },
    ].filter(assignment => assignment.crewMemberId);

    try {
      const response = await fetch('/api/save-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId: selectedRace.id,
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
    console.log({selectedMembers})
    availableDrivers = filterCrewMembers(crewMembers.filter(member => member.isDriver), selectedMembers);
    availableCrewMembers = filterCrewMembers(crewMembers, selectedMembers);
    console.log({availableDrivers, availableCrewMembers})
  };

  const updateState = () => {
    console.log('hitting setstate')
    updateAvailableCrewMembers()
    console.log(availableCrewMembers)
  };


  if (!activeCarnival) {
    return (
      <div className="flex flex-col items-center">
        <h1>Please select a carnival from the <a href="/carnivals">Carnivals</a> page.</h1>
      </div>
    );
  }

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
            <Select
              onValueChange={() => updateState()}
              >
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

      <Button className="mt-4" onClick={handleSaveAssignments}>Save Assignments</Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const crewMembers = await getCrewMembers();
  return {
    props: {
      crewMembers,
    },
  };
};

export default CrewAssignPage;
