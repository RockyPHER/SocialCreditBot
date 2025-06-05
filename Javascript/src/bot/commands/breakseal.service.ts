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
export class BreakSealUserService {
  @SlashCommand({
    name: 'quebrar-selo',
    description:
      'Quebra o selo de um usuário para que ele possa interagir novamente.',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onBreakSealUser(
    @Context() [interaction],
    @Options() { usuario }: UserDTO,
  ) {
    const member = interaction.guild?.members.cache.get(usuario.id);
    const cargoMembroId = '1369494846586359808';

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true,
      });
    }

    try {
      await member.roles.set([cargoMembroId]);

      // Embed com o GIF
      const embed = new EmbedBuilder()
        .setTitle('Usuário liberto!')
        .setDescription(`✅ O usuário <@${usuario.id}> foi libertado.`)
        .setImage(
          'https://cdn.discordapp.com/attachments/1377870030712082452/1377870521324011571/aizen-sosuke-aizen.gif?ex=683a896b&is=683937eb&hm=c7366a5d4b79116a60746830e100e59820e3b2cd5d1b600cd56df554ffb0b514&',
        )
        .setColor('Green');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao libertar o usuário.',
        ephemeral: true,
      });
    }
  }
}
