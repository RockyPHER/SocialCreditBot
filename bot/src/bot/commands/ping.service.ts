import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class PingService {
  @SlashCommand({
    name: 'ping',
    description: 'Ping command!',
    guilds: [String(process.env.GUILD_ID)],
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }
}
