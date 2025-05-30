import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On, Once } from 'necord';

@Injectable()
export class ReadyService {
  private readonly logger = console;

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    console.clear();
    console.log(`[CLIENT] Bot is ready! Logged in as ${client.user.tag}`);

    try {
      if (client.application?.commands) {
        console.log('Iniciando o reset dos comandos globais...');

        await client.application.commands.set([]);
        console.log('✅ Comandos globais resetados.');
      } else {
        console.error('Erro: client.application.commands não está disponível.');
      }
    } catch (error) {
      console.error('Erro ao resetar os comandos:', error);
    }
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }
}
