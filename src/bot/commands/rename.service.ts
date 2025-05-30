import { Injectable } from '@nestjs/common';
import { ChannelType, PermissionsBitField, TextChannel } from 'discord.js';
import {
  Context,
  Options,
  SlashCommand,
  SlashCommandContext,
  StringOption,
} from 'necord';

class NameDTO {
  @StringOption({
    name: 'name',
    description: 'New channel name',
    required: true,
  })
  name: string;
}

@Injectable()
export class RenameChannelService {
  @SlashCommand({
    name: 'rename',
    description: 'Rename channel!',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onRenameChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: NameDTO,
  ) {
    const channel = interaction.channel;

    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: '❌ Este comando só pode ser usado em canais de texto.',
        ephemeral: true,
      });
    }

    if (!interaction.guild) {
      return interaction.reply({
        content: '❌ Esse comando só funciona em servidores.',
        ephemeral: true,
      });
    }

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.ManageChannels,
      )
    ) {
      return interaction.reply({
        content: '❌ Você não tem permissão para renomear canais.',
        ephemeral: true,
      });
    }

    try {
      await (channel as TextChannel).setName(name);
      await interaction.reply(`✅ Canal renomeado para **${name}**`);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao renomear o canal.',
        ephemeral: true,
      });
    }
  }
}
