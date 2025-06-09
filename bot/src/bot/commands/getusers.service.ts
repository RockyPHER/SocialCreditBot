import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { UsersService } from '../../database/users/users.service';
import { EmbedPagesService } from 'src/utils/embedpages.service';

interface User {
  userid: string;
  socialcredits: number;
}

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
      const users: User[] = await this.usersService.getUsers();

      if (!users.length) {
        return interaction.reply({
          content: 'Nenhum usuário encontrado no banco de dados.',
          ephemeral: true,
        });
      }

      const sortedUsers = [...users].sort(
        (a, b) => b.socialcredits - a.socialcredits,
      );

      const formatUser = (user: User, index: number): string =>
        user.socialcredits === 0
          ? `**•** \`${user.socialcredits}\` — <@${user.userid}>`
          : `**${index + 1}.** \`${user.socialcredits}\` — <@${user.userid}>`;

      await this.embedPagesService.generateEmbedPages(
        [interaction],
        'Ranking de Créditos Sociais',
        sortedUsers,
        20,
        formatUser,
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
