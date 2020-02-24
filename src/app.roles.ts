import { RolesBuilder } from 'nest-access-control';

export enum Roles {
  GuildMaster = 'Guild Master',
  Officer = 'Officer',
  OfficerAlt = 'Officer Alt',
  RaiderBank = 'Raider (Bank)',
  Raider = 'Raider',
  Recruit = 'Recruit',
  Fan = 'Fan',
  PlayerAlt = 'Player Alt',
  Guest = 'Guest',
}

export const roleBuilder: RolesBuilder = new RolesBuilder();

roleBuilder
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
  .createAny('form')
  .updateAny('form')
  .deleteAny('form')
  .createAny('raid')
  .updateAny('user')
  .deleteAny('user')
  .updateAny('raid');
