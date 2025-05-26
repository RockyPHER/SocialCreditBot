import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { UsersService } from 'src/database/users.service';

@Injectable()
export class getUsersService {
  constructor(private readonly usersService: UsersService) {} // Injeção de dependência do UsersService

  @SlashCommand({
    name: 'getusers',
    description: 'Get users from the database',
  })
  public async getUsers(@Context() [interaction]: SlashCommandContext) {
    try {
      const users = await this.usersService.getUsers(); // Chama o método para buscar os usuários

      return interaction.reply({
        content: `Usuários encontrados: ${users.map((user) => user.username).join(', ')}`,
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return interaction.reply({
        content: 'Houve um erro ao buscar os usuários.',
      });
    }
  }
}
