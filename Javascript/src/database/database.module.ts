import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService, PrismaService],
})
export class DatabaseModule {}
