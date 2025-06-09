import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [CommandsModule, EventsModule],
})
export class BotModule {}
