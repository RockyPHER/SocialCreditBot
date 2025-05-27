import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async incrementSocialCredits(userid: string, amount: number) {
    console.log('Incrementing social credits:', { userid, amount });

    return this.prisma.user.update({
      where: { userid },
      data: {
        socialcredits: {
          increment: amount,
        },
      },
    });
  }

  async decrementSocialCredits(userid: string, amount: number) {
    console.log('Decrementing social credits:', { userid, amount });
    return this.prisma.user.update({
      where: { userid },
      data: {
        socialcredits: {
          decrement: amount,
        },
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async ensureUserExists(userid: string, username: string) {
    let user = await this.prisma.user.findUnique({
      where: { userid },
    });

    console.log('Ensuring user exists:', { userid, username });
    console.log('Found user:', user);

    if (!user) {
      user = await this.prisma.user.create({
        data: { userid, username },
      });
    }

    return user;
  }
}
