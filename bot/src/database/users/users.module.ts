import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
