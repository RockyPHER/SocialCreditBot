import { Module } from '@nestjs/common';
import { ReadyService } from './ready.service';
import { MessageService } from './message.service';

@Module({
  providers: [ReadyService, MessageService],
})
export class EventsModule {}
