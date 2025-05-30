import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { PongService } from './pong.service';
import { GetUsersService } from './getusers.service';
import { ListChannelsService } from './listchannels.service';
import { DatabaseModule } from 'src/database/database.module';
import { RenameChannelService } from './rename.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    PingService,
    GetUsersService,
    ListChannelsService,
    PongService,
    RenameChannelService,
  ],
})
export class CommandsModule {}
