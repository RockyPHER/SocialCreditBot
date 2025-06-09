import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Role,
} from 'discord.js';
import { Context, createCommandGroupDecorator, Subcommand } from 'necord';

export const RolesCommandDecorator = createCommandGroupDecorator({
  name: 'roles',
  description: 'Comandos de gerenciamento de cargos',
  guilds: [String(process.env.GUILD_ID)],
});

@RolesCommandDecorator()
export class RolesCommands {
  @Subcommand({
    name: 'list',
    description: 'Lista os cargos disponíveis',
  })
  public async listRoles(@Context() [interaction]) {
    const rolesArray = interaction.guild.roles.cache
      .filter((role) => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position) // ordem decrescente
      .map((role: Role) => `${role.position}. ${role.name} - ${role.id}`);

    if (!rolesArray.length) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Nenhum cargo disponível')
            .setDescription('Não há cargos disponíveis no servidor.')
            .setColor(0xff0000),
        ],
        ephemeral: true,
      });
      return;
    }

    const chunkSize = 25;
    const totalPages = Math.ceil(rolesArray.length / chunkSize);
    let currentPage = 0;

    const getPageEmbed = (page: number) => {
      const start = page * chunkSize;
      const end = start + chunkSize;
      const pageRoles = rolesArray.slice(start, end).join('\n');

      return new EmbedBuilder()
        .setTitle('Cargos Disponíveis')
        .setDescription('```' + pageRoles + '```')
        .setColor(0x5865f2)
        .setFooter({ text: `Página ${page + 1} de ${totalPages}` })
        .setTimestamp();
    };

    const createButtons = () =>
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('prev_page')
          .setLabel('◀')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId('next_page')
          .setLabel('▶')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === totalPages - 1),
      );

    const reply = await interaction.reply({
      embeds: [getPageEmbed(currentPage)],
      components: [createButtons()],
      fetchReply: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000, // 1 minuto
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: 'Só quem usou o comando pode interagir.',
          ephemeral: true,
        });
        return;
      }

      if (i.customId === 'prev_page' && currentPage > 0) {
        currentPage--;
      } else if (i.customId === 'next_page' && currentPage < totalPages - 1) {
        currentPage++;
      }

      await i.update({
        embeds: [getPageEmbed(currentPage)],
        components: [createButtons()],
      });
    });

    collector.on('end', async () => {
      await reply.edit({ components: [] }).catch(() => null);
    });
  }
}
