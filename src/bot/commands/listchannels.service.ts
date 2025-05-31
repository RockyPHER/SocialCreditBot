import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { ChannelType, GuildBasedChannel } from 'discord.js';

@Injectable()
export class ListChannelsService {
  @SlashCommand({
    name: 'listchannels',
    description: 'Lista todas as categorias e canais do servidor em markdown.',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onGetChannels(@Context() [interaction]: SlashCommandContext) {
    const guild = interaction.guild;
    if (!guild || !guild.available) {
      await interaction.reply({
        content: '❌ Não foi possível obter o servidor.',
        ephemeral: true,
      });
      return;
    }

    // Atualiza o cache de canais
    await guild.channels.fetch();

    // Filtra só canais com posição (GuildChannel)
    const guildChannels = guild.channels.cache
      .filter(
        (c): c is GuildBasedChannel =>
          'rawPosition' in c && typeof (c as any).rawPosition === 'number',
      )
      .sort((a, b) => (a as any).rawPosition - (b as any).rawPosition);

    const categorias = guildChannels
      .filter((c) => c.type === ChannelType.GuildCategory)
      .map((cat) => {
        const filhos = guildChannels
          .filter((c) => c.parentId === cat.id)
          .map((c) => {
            const prefixo =
              c.type === ChannelType.GuildText
                ? '#'
                : c.type === ChannelType.GuildVoice
                  ? '🔊'
                  : c.type === ChannelType.GuildAnnouncement
                    ? '📢'
                    : '📁';
            return `    ${prefixo} ${c.name}`;
          })
          .join('\n');

        return `**📁 ${cat.name}**\n${filhos}`;
      })
      .join('\n\n');

    const semCategoria = guildChannels
      .filter((c) => !c.parent && c.type !== ChannelType.GuildCategory)
      .map((c) => {
        const prefixo =
          c.type === ChannelType.GuildText
            ? '#'
            : c.type === ChannelType.GuildVoice
              ? '🔊'
              : c.type === ChannelType.GuildAnnouncement
                ? '📢'
                : '📁';
        return `${prefixo} ${c.name}`;
      })
      .join('\n');

    const resposta = (
      categorias +
      (semCategoria ? `\n\n**Sem categoria**\n${semCategoria}` : '')
    ).trim();

    await interaction.reply({
      content:
        '```markdown\n' + (resposta || 'Nenhum canal encontrado.') + '\n```',
    });
  }
}
