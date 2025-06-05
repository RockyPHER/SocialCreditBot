import { Injectable } from '@nestjs/common';
import { Context, SlashCommand } from 'necord';
import { EmbedPagesService } from 'src/utils/embedpages.service';
import { Role } from 'discord.js';

@Injectable()
export class ListRolesService {
  constructor(private readonly embedPagesService: EmbedPagesService) {}
  @SlashCommand({
    name: 'cargos',
    description: 'Lista todos os cargos do servidor.',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onListRoles(@Context() [interaction]) {
    const roles = Array.from(
      interaction.guild?.roles.cache
        .filter((role) => role.name !== '@everyone')
        .sort((a, b) => b.position - a.position)
        .values(),
    );

    if (!roles || roles.length === 0) {
      return interaction.reply({
        content: '❌ Nenhum cargo encontrado neste servidor.',
        ephemeral: true,
      });
    }

    const formatRole = (role: Role) => `• <@&${role.id}> \`(${role.id})\``;

    await this.embedPagesService.generateEmbedPages(
      [interaction], // contexto do Necord
      '📜 Lista de Cargos', // título do embed
      roles, // array de dados
      10, // tamanho da página
      formatRole, // formatação do cargo
    );
  }
}
