import { Injectable } from '@nestjs/common';
import { Context, SlashCommand } from 'necord';
import { EmbedBuilder } from 'discord.js';

@Injectable()
export class ListRolesService {
  @SlashCommand({
    name: 'cargos',
    description: 'Lista todos os cargos do servidor.',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onListRoles(@Context() [interaction]) {
    const roles = interaction.guild?.roles.cache
      .filter((role) => role.name !== '@everyone') // remove o cargo padrão
      .sort((a, b) => b.position - a.position); // ordem do Discord, do topo pra base

    if (!roles || roles.size === 0) {
      return interaction.reply({
        content: '❌ Nenhum cargo encontrado neste servidor.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📜 Lista de Cargos')
      .setDescription(
        roles
          .map((role) => `• <@&${role.id}> \`(${role.id})\``)
          .join('\n')
          .slice(0, 4096), // limite de caracteres do Discord
      )
      .setColor('Blurple');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
