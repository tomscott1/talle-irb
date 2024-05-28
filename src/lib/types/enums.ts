// src/types/enums.ts

export enum CrewRole {
    DRIVER = 'DRIVER',
    CREWIE = 'CREWIE',
    PATIENT = 'PATIENT',
  }
  
  export enum Round {
    ROUND1 = 'ROUND1',
    ROUND2 = 'ROUND2',
    QUARTERFINAL = 'QUARTERFINAL',
    SEMIFINAL = 'SEMIFINAL',
    FINAL = 'FINAL',
  }
  
  export enum RaceCrewType {
    STANDARD = 'STANDARD',
    EXTRAPATIENT = 'EXTRAPATIENT',
    EXTRACREW = 'EXTRACREW',
  }
  
  export interface Race {
    id: number;
    carnivalId: number;
    description: string;
    order: number;
    goThrough: number;
    numRaces: number;
    currentHeatNum: number;
    round: Round;
    raceCrewType: RaceCrewType;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  