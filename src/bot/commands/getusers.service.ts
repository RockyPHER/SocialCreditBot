import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { UsersService } from '../../database/users.service';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from 'discord.js';

@Injectable()
export class GetUsersService {
  constructor(private readonly usersService: UsersService) {}

  @SlashCommand({
    name: 'getusers',
    description: 'Get users from the database',
  })
  public async onGetUsers(@Context() [interaction]: SlashCommandContext) {
    try {
      const users = await this.usersService.getUsers();

      if (!users.length) {
        return interaction.reply({
          content: 'Nenhum usuário encontrado no banco de dados.',
          ephemeral: true,
        });
      }

      const sortedUsers = users.sort(
        (a, b) => b.socialcredits - a.socialcredits,
      );
      const pageSize = 10;
      const totalPages = Math.ceil(sortedUsers.length / pageSize);

      let currentPage = 0;

      const getPageEmbed = (page: number) => {
        const start = page * pageSize;
        const end = start + pageSize;
        const pageUsers = sortedUsers.slice(start, end);

        const description = pageUsers
          .map((user, index) => {
            const position = start + index + 1;
            return user.socialcredits === 0
              ? `**•** \`${user.socialcredits}\` — <@${user.userid}>`
              : `**${position}** \`${user.socialcredits}\` — <@${user.userid}>`;
          })
          .join('\n');

        return new EmbedBuilder()
          .setTitle('Ranking Social Credits')
          .setDescription(description)
          .setFooter({ text: `Página ${page + 1} de ${totalPages}` })
          .setColor(0x5865f2)
          .setTimestamp();
      };

      const getActionRow = (page: number) => {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('◀')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages - 1),
        );
      };

      await interaction.reply({
        embeds: [getPageEmbed(currentPage)],
        components: [getActionRow(currentPage)],
        withResponse: true,
      });

      if (!interaction.channel) {
        return interaction.followUp({
          content: 'Não foi possível acessar o canal para coletar interações.',
          ephemeral: true,
        });
      }

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60_000, // 1 minuto de duração
      });

      collector.on('collect', async (btnInteraction) => {
        if (btnInteraction.user.id !== interaction.user.id) {
          return btnInteraction.reply({
            content: 'Este botão não é para você.',
            ephemeral: true,
          });
        }

        await btnInteraction.deferUpdate();

        if (
          btnInteraction.customId === 'next' &&
          currentPage < totalPages - 1
        ) {
          currentPage++;
        } else if (btnInteraction.customId === 'prev' && currentPage > 0) {
          currentPage--;
        }

        await interaction.editReply({
          embeds: [getPageEmbed(currentPage)],
          components: [getActionRow(currentPage)],
        });
      });

      collector.on('end', () => {
        interaction.editReply({
          components: [], // remove os botões após o tempo
        });
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return interaction.reply({
        content: 'Houve um erro ao buscar os usuários.',
        ephemeral: true,
      });
    }
  }
}
