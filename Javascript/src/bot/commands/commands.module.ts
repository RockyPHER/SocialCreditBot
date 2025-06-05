import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { GetUsersService } from './getusers.service';
import { ListChannelsService } from './listchannels.service';
import { DatabaseModule } from 'src/database/database.module';
import { RenameChannelService } from './rename.service';
import { SealUserService } from './seal.service';
import { BreakSealUserService } from './breakseal.service';
import { ListRolesService } from './roles.service';
import { TodoListCommands } from './todo.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AddImageCommands } from './add.service';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [
    PingService,
    GetUsersService,
    ListChannelsService,
    RenameChannelService,
    SealUserService,
    BreakSealUserService,
    ListRolesService,
    TodoListCommands,
    AddImageCommands,
  ],
})
export class CommandsModule {}
