import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const items = [
    { id: 1 , name: "Billy" },
    { id: 2 , name: "Bob" },
    { id: 3 , name: "Joe" },
    { id: 4 , name: "Sue" }, 
    { id: 5 , name: "Jane"}
]

export default function LikePage() {
    const [selectedFirstName, setSelectedFirstName] = useState<string | null>(null);
    const [selectedSecondName, setSelectedSecondName] = useState<string | null>(null);

    // Filter items based on the selected names
    const filteredFirstItems = items.filter((item) => item.name !== selectedSecondName);
    const filteredSecondItems = items.filter((item) => item.name !== selectedFirstName);

    return (
        <div>
            <div>
                <Select value={selectedFirstName ?? ''} onValueChange={setSelectedFirstName}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={selectedFirstName || `select a person`} />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredFirstItems.map((item) => (
                        <SelectItem key={item.id} value={item.name} onSelect={() => setSelectedFirstName(item.name)}>
                            {item.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select value={selectedSecondName ?? ''} onValueChange={setSelectedSecondName}>
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selectedSecondName || `select a person`} />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredSecondItems.map((item) => (
                        <SelectItem key={item.id} value={item.name} onSelect={() => setSelectedSecondName(item.name)}>
                            {item.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
      </div>
    );
}
