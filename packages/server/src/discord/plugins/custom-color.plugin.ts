import { Injectable } from '@nestjs/common';
import { Context } from '../discord.context';
import { Command, Plugin } from '../discord.decorators';

@Injectable()
@Plugin('CustomColor')
export class CustomColor {
  @Command({
    name: 'color',
    description: 'Sets a custom color on a color.',
  })
  private async setCustomColor(ctx: Context, color: string) {
    if (!ctx.message.guild) {
      return ctx.send('This command is not available in DM!');
    }

    const member = ctx.message.member;

    if (
      !member.roles.cache.some((r) =>
        ['Recruit', 'Raiders'].includes(r.name),
      ) &&
      !member.hasPermission('MANAGE_MESSAGES')
    ) {
      return ctx.send(
        'You must be at least a recruit or raider to use this command!\nWe have limited role slots on our server.',
      );
    }

    let role = ctx.message.member.roles.cache.find(
      (r) => r.name === 'Custom Color',
    );

    if (!role) {
      role = await ctx.message.guild.roles.create({
        data: {
          color: color,
          hoist: false,
          name: 'Custom Color',
          mentionable: false,
          position: ctx.message.guild.me.roles.highest.position,
        },
        reason: 'Custom user color',
      });
      await member.roles.add(role);
    } else {
      await role.setColor(color);
    }

    await ctx.tick();

    return ctx.message.delete({
      timeout: 5000,
    });
  }
}
