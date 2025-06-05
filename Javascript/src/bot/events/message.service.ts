import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';
import { Message, PartialMessage } from 'discord.js';
import { UsersService } from '../../database/users.service';
@Injectable()
export class MessageService {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = console;

  @On('messageCreate')
  public async onMessageCreate(
    @Context() [message]: ContextOf<'messageCreate'>,
  ) {
    if (message.author.bot) return;

    await this.usersService.ensureUserExists(
      message.author.id,
      message.author.tag,
    );

    if (message.content === 'test') {
      await message.reply('Testado!');
    }

    this.logger.log(
      `[messageCreate] ${message.author.tag}: ${message.content}`,
    );
  }

  @On('messageUpdate')
  public onMessageUpdate(
    @Context() [oldMessage, newMessage]: ContextOf<'messageUpdate'>,
  ) {
    if (newMessage.author.bot) return;
    const oldContent = (oldMessage as Message).content ?? '[unknown]';
    const newContent = (newMessage as Message).content ?? '[unknown]';

    this.logger.log(`[messageUpdate] "${oldContent}" -> "${newContent}"`);
  }

  @On('messageDelete')
  public onMessageDelete(@Context() [message]: ContextOf<'messageDelete'>) {
    if (message.author?.bot) return;
    const content = (message as PartialMessage).content ?? '[sem conteúdo]';
    this.logger.log(`[messageDelete] Mensagem deletada: ${content}`);
  }
}
