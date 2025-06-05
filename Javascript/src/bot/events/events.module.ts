import { Module } from '@nestjs/common';
import { ReadyService } from './ready.service';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ReadyService, MessageService],
})
export class EventsModule {}
