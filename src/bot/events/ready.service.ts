import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On, Once } from 'necord';

@Injectable()
export class ReadyService {
  private readonly logger = console;

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    console.clear();
    console.log(`[CLIENT] Bot is ready! Logged in as ${client.user.tag}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }
}
