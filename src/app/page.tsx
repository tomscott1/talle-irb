import { ModeToggle } from "@/components/ui/dark-mode";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex">
      <ModeToggle />
    </main>
  );
}
