// src/store/carnival-store.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

type Carnival = {
  id: number;
  name: string;
};

type CarnivalState = {
  activeCarnival: Carnival | null;
  setActiveCarnival: (carnival: Carnival) => void;
};

export const useCarnivalStore = create<CarnivalState>()(
  persist(
    (set) => ({
      activeCarnival: null,
      setActiveCarnival: (carnival) => set({ activeCarnival: carnival }),
    }),
    {
      name: 'carnival-store', // unique name for the storage key
    }
  )
);
