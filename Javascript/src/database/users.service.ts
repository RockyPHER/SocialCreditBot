import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async ensureUserExists(userid: string, username: string) {
    let user = await this.prisma.user.findUnique({
      where: { userid },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { userid, username },
      });
    }

    return user;
  }
}
