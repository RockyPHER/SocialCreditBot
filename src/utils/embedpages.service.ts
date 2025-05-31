import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import { ButtonStyle, ComponentType } from 'discord.js';
import { Context, SlashCommandContext } from 'necord';

@Injectable()
export class EmbedPagesService {
  public async generateEmbedPages<T>(
    @Context() [interaction]: SlashCommandContext,
    embedTitle: string,
    items: T[],
    pageSize: number,
    formatItem: (item: T, index: number) => string, // <-- função genérica
  ): Promise<void> {
    const totalPages = Math.ceil(items.length / pageSize);
    let currentPage = 0;

    const getPageEmbed = (page: number): EmbedBuilder => {
      const start = page * pageSize;
      const end = start + pageSize;
      const pageItems = items.slice(start, end);

      const description =
        pageItems
          .map((item, index) => formatItem(item, start + index))
          .join('\n') || 'Nenhum item nesta página.';

      return new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(description)
        .setFooter({ text: `Página ${page + 1} de ${totalPages}` })
        .setColor(0x5865f2)
        .setTimestamp();
    };

    const getActionRow = (page: number) =>
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('◀')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('▶')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page >= totalPages - 1),
      );

    await interaction.reply({
      embeds: [getPageEmbed(currentPage)],
      components: [getActionRow(currentPage)],
    });

    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on('collect', async (btnInteraction) => {
      if (btnInteraction.user.id !== interaction.user.id)
        return btnInteraction.reply({
          content: 'Este botão não é para você.',
          ephemeral: true,
        });

      await btnInteraction.deferUpdate();

      if (btnInteraction.customId === 'next' && currentPage < totalPages - 1)
        currentPage++;
      else if (btnInteraction.customId === 'prev' && currentPage > 0)
        currentPage--;

      await interaction.editReply({
        embeds: [getPageEmbed(currentPage)],
        components: [getActionRow(currentPage)],
      });
    });

    collector.on('end', () => {
      interaction.editReply({ components: [] }).catch(() => {});
    });
  }
}
