import {
  Fight,
  Report,
  Zone,
} from '../../../warcraftlogs/interfaces/reports.interface';

export class WarcraftLogReport {
  private readonly code: string;
  private readonly title: string;
  private readonly start: Date;
  private readonly end: Date;
  private readonly owner: string;
  private readonly zone: Zone;
  private readonly fights: Fight[];

  constructor(data: Report, zone: Zone) {
    this.code = data.code;
    this.start = new Date(data.startTime);
    this.end = new Date(data.endTime);
    this.owner = data.owner.name;
    this.title = data.title;
    this.zone = zone;
    this.fights = data.fights;
  }
}
