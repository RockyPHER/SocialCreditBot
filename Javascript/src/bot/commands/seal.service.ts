import {
  Context,
  createCommandGroupDecorator,
  Options,
  Subcommand,
  UserOption,
} from 'necord';
import { User, EmbedBuilder } from 'discord.js';

class UserDTO {
  @UserOption({
    name: 'usuario',
    description: 'Usuário a ser selado',
    required: true,
  })
  usuario: User;
}

export const SealCommandDecorator = createCommandGroupDecorator({
  name: 'seal',
  description: 'Selamento',
  guilds: [String(process.env.GUILD_ID)],
});

@SealCommandDecorator()
export class SealUserCommands {
  // Comando principal: /seal
  @Subcommand({
    name: '_',
    description: 'Sela um usuário para que ele não cause mais problemas.',
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
      await member.roles.set([cargoExiladoId]);

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

  // Subcomando: /seal break
  @Subcommand({
    name: 'break',
    description: 'Quebra o selo do usuário',
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
