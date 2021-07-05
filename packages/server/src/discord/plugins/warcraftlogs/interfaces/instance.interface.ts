import {
  Difficulty,
  Zone,
} from '../../../../warcraftlogs/interfaces/reports.interface';

export interface Instance {
  zone: Zone;
  difficulties: InstanceDifficulty[];
}

export interface InstanceDifficulty extends Difficulty {
  id: number;
  name: string;
  encounters: Encounter[];
}

export interface Encounter {
  name: string;
  encounterID: number;
  kill?: number;
  attempts: number;
  bestPercent: number;
}
