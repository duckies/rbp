import { CustomDecorator, Inject, SetMetadata } from '@nestjs/common';
import { DISCORD_CLIENT, DISCORD_COG, DISCORD_COG_COMMAND, DISCORD_COG_GROUP } from '../app.constants';
import { isString } from '../utils/shared.utils';

export interface CogOptions {
  /**
   * Name of the cog used for help or
   */
  name: string;
}

/**
 * Decorator that marks a class as a Discord cog.
 *
 * @param {string} name string of the name of the cog housing commands.
 */
export function Cog(name: string): CustomDecorator<string>;

/**
 * Decorator that marks a class as a Discord cog.
 *
 * @param {object} options configuration object specifying:
 *
 * - `name` - string that defines the name of the cog housing commands.
 */
export function Cog(options: CogOptions): CustomDecorator<string>;

export function Cog(nameOrOptions: string | CogOptions): CustomDecorator<string> {
  return SetMetadata(DISCORD_COG, isString(nameOrOptions) ? { name: nameOrOptions } : nameOrOptions);
}

export interface Group extends GroupOptions {
  method: string;
  commands: Map<string, Command>;
}

export interface Command extends CommandOptions {
  method: string;
}

export interface CommandOptions {
  /**
   * Specifies the command name that is typed into Discord to invoke it.
   * The prefix is prepended to this name.
   */
  name: string;

  /**
   * Specifies if the command is part of a group.
   */
  group?: string;

  /**
   * Specifies the description of the command. This should be a short one-liner.
   */
  description?: string;

  /**
   * Specifies optional names to invoke the commmand with for convenience.
   */
  alias?: string[];
}

export interface CommandGroup {
  /**
   * Defines the name of a command group.
   */
  name: string;

  /**
   * Specifies if the command group is not meant to be invoked.
   */
  abstract?: boolean;

  /**
   * Specifies if invoking the command group should show help text.
   */
  autoHelp?: boolean;
}

export interface GroupOptions {
  name: string;
  alias?: string[];
}

export function CommandGroup(name: string): MethodDecorator;
export function CommandGroup(options: GroupOptions): MethodDecorator;
export function CommandGroup(nameOrOptions: string | GroupOptions): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const groups = Reflect.getOwnMetadata(DISCORD_COG_GROUP, target) || [];
    const options = isString(nameOrOptions) ? { name: nameOrOptions } : nameOrOptions;

    groups.push({ ...options, method: propertyKey });

    Reflect.defineMetadata(DISCORD_COG_GROUP, groups, target);
  };
}

// export function Command(name: string): MethodDecorator;
export function Command(options: CommandOptions): MethodDecorator;
export function Command(nameOrOptions: CommandOptions): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const commands = Reflect.getOwnMetadata(DISCORD_COG_COMMAND, target) || [];
    const options = isString(nameOrOptions) ? { name: nameOrOptions } : nameOrOptions;

    commands.push({ ...options, method: propertyKey });

    Reflect.defineMetadata(DISCORD_COG_COMMAND, commands, target);
  };
}

export const InjectClient = () => Inject(DISCORD_CLIENT);
