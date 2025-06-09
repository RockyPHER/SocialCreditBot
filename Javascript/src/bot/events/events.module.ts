import { Module } from '@nestjs/common';
import { ReadyService } from './ready.service';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [ReadyService, MessageService],
})
export class EventsModule {}
