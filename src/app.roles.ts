import { RolesBuilder } from "nest-access-control";

export enum Roles {
  GuildMaster = 'GUILD_MASTER',
  Officer = 'OFFICER',
  OfficerAlt = 'OFFICER_ALT',
  RaiderBank = 'RAIDER_(BANK)',
  Raider = 'RAIDER',
  Recruit = 'RECRUIT',
  Fan = 'FAN',
  PlayerAlt = 'PLAYER_ALT',
  Guest = 'GUEST'
}

export const NumRanks = 9;

export const Ranks = {
  [0]: Roles.GuildMaster,
  [1]: Roles.Officer,
  [2]: Roles.OfficerAlt,
  [3]: Roles.RaiderBank,
  [4]: Roles.Raider,
  [5]: Roles.Recruit,
  [6]: Roles.Fan,
  [7]: Roles.PlayerAlt,
  [8]: Roles.Guest
};

export const roleBuilder: RolesBuilder = new RolesBuilder();

roleBuilder
  .grant(Roles.Guest)
    .updateOwn('user', ['displayname', 'avatar'])
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
  .grant(Roles.OfficerAlt)
    .extend(Roles.Officer)
  .grant(Roles.GuildMaster)
    .extend(Roles.Officer)
    .createAny('raid')
    .updateAny('user')
    .deleteAny('user')
    .updateAny('raid')

// console.log(roleBuilder.getGrants())
  