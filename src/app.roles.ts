import { AccessControl } from 'accesscontrol';

export enum Roles {
  GuildMaster = 'Rank0',
  Officer = 'Rank1',
  OfficerAlt = 'Rank2',
  RaiderBank = 'Rank3',
  Raider = 'Rank4',
  Recruit = 'Rank5',
  Fan = 'Rank6',
  PlayerAlt = 'Rank7',
  Guest = 'Rank8',
}

export const accessControl = new AccessControl();

accessControl
  .grant(Roles.Guest)
  .updateOwn('user', ['nickname', 'avatar'])
  .updateOwn('form-submission')
  .deleteOwn('user')
  .grant(Roles.Fan)
  .extend(Roles.Guest)
  .grant(Roles.Recruit)
  .extend(Roles.Fan)
  .grant(Roles.Raider)
  .extend(Roles.Recruit)
  .grant(Roles.RaiderBank)
  .extend(Roles.Raider)
  .grant(Roles.Officer)
  .extend(Roles.Raider)
  .readAny('user')
  .createAny('slide')
  .updateAny('slide')
  .deleteAny('slide')
  .createAny('article')
  .updateAny('article')
  .deleteAny('article')
  .createAny('question')
  .updateAny('question')
  .deleteAny('question')
  .updateAny('form-submission')
  .deleteAny('form-submission')
  .grant(Roles.OfficerAlt)
  .extend(Roles.Officer)
  .grant(Roles.GuildMaster)
  .extend(Roles.Officer)
  .createAny('file-upload')
  .updateAny('file-upload')
  .deleteAny('file-upload')
  .createAny('form')
  .updateAny('form')
  .deleteAny('form')
  .createAny('raid')
  .updateAny('user')
  .deleteAny('user')
  .updateAny('raid');

export default accessControl;
