import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { GetUsersService } from './getusers.service';
import { ListChannelsService } from './listchannels.service';
import { DatabaseModule } from 'src/database/database.module';
import { RenameChannelService } from './rename.service';
import { SealUserService } from './seal.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    PingService,
    GetUsersService,
    ListChannelsService,
    RenameChannelService,
    SealUserService,
  ],
})
export class CommandsModule {}
