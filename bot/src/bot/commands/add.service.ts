import {
  Context,
  createCommandGroupDecorator,
  AttachmentOption,
  StringOption,
  Options,
  Subcommand,
} from 'necord';
import {
  CommandInteraction,
  Attachment,
  GuildEmoji,
  Sticker,
} from 'discord.js';
import { Injectable } from '@nestjs/common';
import { ImageService } from 'src/utils/image.service';

const MAX_EMOJI_SIZE = 256 * 1024; // 256 KB
const MAX_STICKER_SIZE = 512 * 1024; // 512 KB

// Grupo de comandos
export const AddImageCommandDecorator = createCommandGroupDecorator({
  name: 'add',
  description: 'Adiciona uma imagem como emoji ou figurinha',
  guilds: [String(process.env.GUILD_ID)],
});

// DTOs
class EmojiDTO {
  @AttachmentOption({
    name: 'imagem',
    description: 'Imagem para o emoji (.png, até 256 KB)',
    required: true,
  })
  imagem: Attachment;

  @StringOption({
    name: 'nome',
    description: 'Nome do emoji',
    required: true,
  })
  nome: string;
}

class FigurinhaDTO {
  @AttachmentOption({
    name: 'imagem',
    description: 'Imagem para a figurinha (.png/.apng, até 512 KB)',
    required: true,
  })
  imagem: Attachment;

  @StringOption({
    name: 'nome',
    description: 'Nome da figurinha',
    required: true,
  })
  nome: string;

  @StringOption({
    name: 'descricao',
    description: 'Descrição da figurinha',
    required: false,
  })
  descricao: string;
}

@AddImageCommandDecorator()
@Injectable()
export class AddImageCommands {
  constructor(private readonly imageService: ImageService) {}
  @Subcommand({
    name: 'emoji',
    description: 'Adiciona uma imagem como emoji personalizado',
  })
  public async onAddEmoji(
    @Context() [interaction]: [CommandInteraction],
    @Options() { imagem, nome }: EmojiDTO,
  ) {
    try {
      if (!interaction.guild) {
        await interaction.reply({
          content: '❌ Não foi possível encontrar o servidor (guild).',
          ephemeral: true,
        });
        return;
      }

      const buffer = await this.imageService.reduceImage(imagem.url, 'emoji');

      if (buffer.length > MAX_EMOJI_SIZE) {
        await interaction.reply({
          content: `❌ A imagem excede o tamanho máximo permitido para emojis (256 KB).`,
          ephemeral: true,
        });
        throw new Error(
          'Imagem excede o tamanho máximo permitido para emojis (256 KB).',
        );
      }

      const emoji: GuildEmoji = await interaction.guild.emojis.create({
        attachment: buffer,
        name: nome,
      });

      await interaction.reply({
        content: `✅ Emoji adicionado com sucesso: <:${emoji.name}:${emoji.id}>`,
      });
    } catch (error) {
      await interaction.reply({
        content: `❌ Erro ao adicionar emoji: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  @Subcommand({
    name: 'sticker',
    description: 'Adiciona uma imagem como figurinha personalizada',
  })
  public async onAddSticker(
    @Context() [interaction]: [CommandInteraction],
    @Options() { imagem, nome, descricao }: FigurinhaDTO,
  ) {
    try {
      if (!interaction.guild) {
        await interaction.reply({
          content: '❌ Não foi possível encontrar o servidor (guild).',
          ephemeral: true,
        });
        throw new Error('Guild não encontrada.');
      }

      const buffer = await this.imageService.reduceImage(imagem.url, 'sticker');

      if (!buffer) {
        await interaction.reply({
          content: '❌ Não foi possível processar a imagem.',
          ephemeral: true,
        });
        throw new Error('Não foi possível processar a imagem.');
      }

      if (buffer.length > MAX_STICKER_SIZE) {
        await interaction.reply({
          content: `❌ A imagem excede o tamanho máximo permitido para figurinhas (512 KB).`,
          ephemeral: true,
        });
        throw new Error(
          'Imagem excede o tamanho máximo permitido para figurinhas (512 KB).',
        );
      }

      const sticker: Sticker = await interaction.guild.stickers.create({
        name: nome,
        description: descricao || 'Figurinha personalizada',
        file: {
          attachment: buffer,
          name: `${nome}.png`,
        },
        tags: '😀', // necessário para validação, pode ser qualquer emoji
      });

      if (!sticker) {
        await interaction.reply({
          content: '❌ Não foi possível criar a figurinha.',
          ephemeral: true,
        });
        throw new Error('Não foi possível criar a figurinha.');
      }

      await interaction.reply({
        content: `✅ Figurinha adicionada com sucesso: ${sticker.name}`,
      });
    } catch (error) {
      await interaction.reply({
        content: `❌ Erro ao adicionar figurinha: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
