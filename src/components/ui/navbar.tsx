import React from 'react';
import { Button } from './button';
import { ModeToggle } from "@/components/ui/dark-mode";
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-transparent h-16 flex items-center justify-between">
            <div className="ml-4">
                Talle IRB Racing Team
            </div>
            <div className="flex items-center mr-4 space-x-4">
                <Link href="/carnivals" className="hover:underline">
                    Carnivals
                </Link>
                <Link href="/crew-assign" className="hover:underline">
                    Assign Crew
                </Link>
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
