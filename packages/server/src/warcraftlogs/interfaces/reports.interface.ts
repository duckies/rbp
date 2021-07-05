export interface ZoneQuery {
  data: {
    worldData: {
      zone: Zone;
    };
  };
}

export interface ReportsQuery {
  data: {
    reportData: Reports;
  };
}

export interface ReportQuery {
  data: {
    reportData: {
      report: Report;
    };
  };
}

export interface EncounterQuery {
  data: {
    worldData: {
      encounter: Encounter & { zone: Zone };
    };
  };
}

export interface Reports {
  reports: {
    data: Report[];
  };
}

export interface Report {
  code: string;
  title: string;
  startTime: number;
  endTime: number;
  fights: Fight[];
  zone: Zone;
  owner: ReportOwner;
}

export interface Fight {
  id: number;
  encounterID: number;
  kill: boolean;
  name: string;
  difficulty: number;
  bossPercentage: number;
  keystoneBonus?: number;
  keystoneLevel?: number;
  keystoneTime?: number;
}

export interface Zone {
  id: number;
  name: string;
  difficulties: Difficulty[];
  encounters: Encounter[];
}

export interface Encounter {
  id: number;
}

export interface Difficulty {
  id: number;
  name: string;
}

export interface ReportOwner {
  name: string;
}
