import { Injectable } from '@nestjs/common';
import { Message, PartialMessage } from 'discord.js';
import { Context, ContextOf, On, Once } from 'necord';

@Injectable()
export class MessageService {
  private readonly logger = console;

  @On('messageCreate')
  public onMessageCreate(@Context() [message]: ContextOf<'messageCreate'>) {
    if (message.author.bot) return;
    this.logger.log(
      `[messageCreate] ${message.author.tag}: ${message.content}`,
    );
  }

  @On('messageUpdate')
  public onMessageUpdate(
    @Context() [oldMessage, newMessage]: ContextOf<'messageUpdate'>,
  ) {
    const oldContent = (oldMessage as Message).content ?? '[unknown]';
    const newContent = (newMessage as Message).content ?? '[unknown]';

    this.logger.log(`[messageUpdate] "${oldContent}" -> "${newContent}"`);
  }

  @On('messageDelete')
  public onMessageDelete(@Context() [message]: ContextOf<'messageDelete'>) {
    const content = (message as PartialMessage).content ?? '[sem conteúdo]';
    this.logger.log(`[messageDelete] Mensagem deletada: ${content}`);
  }
}
