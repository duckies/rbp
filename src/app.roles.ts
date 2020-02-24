import { RolesBuilder } from 'nest-access-control';

export enum Roles {
<<<<<<< HEAD
  GuildMaster = 'Guild Master',
  Officer = 'Officer',
  OfficerAlt = 'Officer Alt',
  RaiderBank = 'Raider (Bank)',
  Raider = 'Raider',
  Recruit = 'Recruit',
  Fan = 'Fan',
  PlayerAlt = 'Player Alt',
  Guest = 'Guest',
=======
  GuildMaster = 'Rank0',
  Officer = 'Rank1',
  OfficerAlt = 'Rank2',
  RaiderBank = 'Rank3',
  Raider = 'Rank4',
  Recruit = 'Rank5',
  Fan = 'Rank6',
  PlayerAlt = 'Rank7',
  Guest = 'Rank8',
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
}

export const roleBuilder: RolesBuilder = new RolesBuilder();

roleBuilder
  .grant(Roles.Guest)
<<<<<<< HEAD
  .updateOwn('user', ['displayname', 'avatar'])
=======
  .updateOwn('user', ['nickname', 'avatar'])
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
  .createAny('form')
  .updateAny('form')
  .deleteAny('form')
  .createAny('raid')
  .updateAny('user')
  .deleteAny('user')
  .updateAny('raid');
