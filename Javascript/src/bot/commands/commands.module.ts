import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { GetUsersService } from './getusers.service';
import { ListChannelsService } from './listchannels.service';
import { DatabaseModule } from 'src/database/database.module';
import { RenameChannelService } from './rename.service';
import { RolesCommands } from './roles.service';
import { TodoListCommands } from './todo.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AddImageCommands } from './add.service';
import { SealUserCommands } from './seal.service';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [
    PingService,
    GetUsersService,
    ListChannelsService,
    RenameChannelService,
    SealUserCommands,
    RolesCommands,
    TodoListCommands,
    AddImageCommands,
  ],
})
export class CommandsModule {}
