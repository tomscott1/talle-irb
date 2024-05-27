"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { ModeToggle } from "@/components/ui/dark-mode";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated to use next/navigation

type Carnival = {
  id: number;
  name: string;
};

const Navbar: React.FC = () => {
  const [carnivals, setCarnivals] = useState<Carnival[]>([]);
  const [selectedCarnival, setSelectedCarnival] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch carnivals from your API
    const fetchCarnivals = async () => {
      try {
        const response = await fetch('/api/carnivals');
        const data = await response.json();
        setCarnivals(data);

        // Set the selected carnival from the query parameter if it exists
        const carnivalIdFromQuery = searchParams.get('carnivalId');
        if (carnivalIdFromQuery) {
          setSelectedCarnival(carnivalIdFromQuery);
        }
      } catch (error) {
        console.error('Error fetching carnivals:', error);
      }
    };

    fetchCarnivals();
  }, [searchParams]);

  const handleSelectCarnival = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCarnivalId = event.target.value;
    setSelectedCarnival(newCarnivalId);
    
    // Get the current pathname to maintain the current page
    const currentPath = window.location.pathname;

    // Update the URL with the new carnival ID
    router.push(`${currentPath}?carnivalId=${newCarnivalId}`);
  };

  const assignLink = selectedCarnival ? `/assign?carnivalId=${selectedCarnival}` : '/assign';

  return (
    <nav className="bg-transparent h-16 flex items-center justify-between">
      <div className="ml-4">
        Talle IRB Racing Team
      </div>
      <div className="flex items-center mr-4 space-x-4">
        <select
          value={selectedCarnival}
          onChange={handleSelectCarnival}
          className="bg-transparent border rounded px-2 py-1"
        >
          <option value="">Select Carnival</option>
          {carnivals.map((carnival) => (
            <option key={carnival.id} value={carnival.id}>
              {carnival.name}
            </option>
          ))}
        </select>
        <Link href={`/race-day?carnivalId=${selectedCarnival}`} className="hover:underline">
          Race Day
        </Link>
        <Link href={assignLink} className="hover:underline">
          Assign Crew
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
