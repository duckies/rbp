import { RolesBuilder } from "nest-access-control";

export enum Roles {
  GuildMaster = 'Guild Master',
  Technician = 'Technician',
  Officer = 'Officer',
  Raider = 'Raider',
  Trial = 'Trial',
  Fan = 'Fan',
  Guest = 'Guest',
}

export const roleBuilder: RolesBuilder = new RolesBuilder();

roleBuilder
  .grant(Roles.Guest)
    .updateOwn('user', ['displayname', 'avatar'])
    .deleteOwn('user')
  .grant(Roles.Fan)
    .extend(Roles.Guest)
  .grant(Roles.Trial)
    .extend(Roles.Fan)
  .grant(Roles.Raider)
    .extend(Roles.Trial)
  .grant(Roles.Officer)
    .extend(Roles.Raider)
    .readAny('user')
    .createAny('slide')
    .updateAny('slide')
    .deleteAny('slide')
    .createAny('article')
    .updateAny('article')
    .deleteAny('article')
  .grant(Roles.Technician)
    .extend(Roles.Officer)
    .createAny('raid')
  .grant(Roles.GuildMaster)
    .extend(Roles.Officer)
    .updateAny('user')
    .deleteAny('user')
    .updateAny('raid')

// console.log(roleBuilder.getGrants())
  