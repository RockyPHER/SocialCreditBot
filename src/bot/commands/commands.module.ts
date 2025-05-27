import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { DatabaseModule } from 'src/database/database.module';
import { GetUsersService } from './getusers.service';

@Module({
  imports: [DatabaseModule],
  providers: [PingService, GetUsersService],
})
export class CommandsModule {}
