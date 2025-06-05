import { Injectable } from '@nestjs/common';
import { User, EmbedBuilder } from 'discord.js';
import { Context, Options, SlashCommand, UserOption } from 'necord';

class UserDTO {
  @UserOption({
    name: 'usuario',
    description: 'Usuário a ser selado',
    required: true,
  })
  usuario: User;
}

@Injectable()
export class SealUserService {
  @SlashCommand({
    name: 'selar',
    description: 'Sela um usuário para que ele não cause mais problemas.',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onSealUser(
    @Context() [interaction],
    @Options() { usuario }: UserDTO,
  ) {
    const member = interaction.guild?.members.cache.get(usuario.id);
    const cargoExiladoId = '1374444678912544829';

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true,
      });
    }

    try {
      // Remove todos os cargos e adiciona apenas o cargo exilado
      await member.roles.set([cargoExiladoId]);

      // Embed com o GIF
      const embed = new EmbedBuilder()
        .setTitle('Usuário selado com sucesso')
        .setDescription(`✅ O usuário <@${usuario.id}> foi exilado.`)
        .setImage(
          'https://media.discordapp.net/attachments/1377862331182219376/1377862379311726713/aizen-seal.gif?ex=683a81d6&is=68393056&hm=2276dcc86ca60bc5440444cea8fd0014ea500f14d14f32da988c7120ed07a488&=&width=500&height=281',
        )
        .setColor('Red');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao selar o usuário.',
        ephemeral: true,
      });
    }
  }
}
