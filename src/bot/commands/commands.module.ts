import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PingService],
})
export class CommandsModule {}
