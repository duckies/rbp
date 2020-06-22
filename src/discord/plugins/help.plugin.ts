import { Injectable } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { Context } from '../discord.context';
import { Command, Plugin } from '../discord.decorators';
import { GroupMapMeta, PluginCommandMap, PluginGroupMap } from '../discord.service';

export interface HelpText {
  name: string;
  value: string;
}

@Injectable()
@Plugin({ name: 'Help' })
export class HelpPlugin {
  @Command({ name: 'help', description: 'Shows the description of a command or group' })
  async help(ctx: Context) {
    const embed = new MessageEmbed();
    embed.setTitle('RBP Bot Help Menu');
    embed.setColor(0xc328ff);

    for (const [name, plugin] of ctx.plugins) {
      const helpText: HelpText[] = this._sortHelp([
        ...this._buildHelp(plugin.groups),
        ...this._buildHelp(plugin.commands),
      ]);

      if (!helpText.length) continue;

      embed.addField(name, helpText.map((text) => `**${ctx.prefix}${text.name}**: ${text.value}`).join('\n'));
    }

    await ctx.message.channel.send(embed);
  }

  private _buildHelp(commandsOrGroups: PluginCommandMap | PluginGroupMap) {
    const text = [];

    for (const [name, instance] of commandsOrGroups) {
      text.push({ name, value: instance.description || 'No description' });
    }

    return text;
  }

  public async sendGroupHelp(ctx: Context, group: GroupMapMeta) {
    const helpText = this._sortHelp(this._buildHelp(group.commands));

    const embed = new MessageEmbed();
    embed.setTitle(`Subcommand Help Menu`);
    embed.setDescription(`Commands for the \`${ctx.prefix}${group.name}\` group.`);
    embed.setColor(0xc328ff);

    embed.addField(group.name, helpText.map((text) => `**${text.name}**: ${text.value}`).join('\n'));

    await ctx.message.channel.send(embed);
  }

  private _sortHelp(text: HelpText[]) {
    return text.sort((a, b) => a.name.localeCompare(b.name));
  }
}
