import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { UsersService } from '../../database/users.service';
import { EmbedPagesService } from 'src/utils/embedpages.service';

@Injectable()
export class GetUsersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly embedPagesService: EmbedPagesService,
  ) {}

  @SlashCommand({
    name: 'getusers',
    description: 'Get users from the database',
    guilds: [String(process.env.GUILD_ID)],
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

      interface User {
        userid: string;
        socialcredits: number;
      }

      const formatUser = (user: User, index: number): string =>
        user.socialcredits === 0
          ? `**•** \`${user.socialcredits}\` — <@${user.userid}>`
          : `**${index + 1}** \`${user.socialcredits}\` — <@${user.userid}>`;

      await this.embedPagesService.generateEmbedPages(
        [interaction], // contexto do Necord
        'Ranking de Créditos Sociais', // título do embed
        sortedUsers, // array de dados
        10, // tamanho da página
        (
          user,
          index, // função que formata cada item
        ) => formatUser(user, index), // formatação do usuário
      );
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return interaction.reply({
        content: 'Houve um erro ao buscar os usuários.',
        ephemeral: true,
      });
    }
  }
}
