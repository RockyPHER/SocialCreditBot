import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany(); // Utiliza o Prisma Client para pegar todos os usuários
  }

  async ensureUserExists(userid: string, username: string) {
    const existing = await this.prisma.user.findUnique({
      where: { userid },
    });

    if (!existing) {
      await this.prisma.user.create({
        data: {
          userid,
          username,
        },
      });
    }
  }
}
