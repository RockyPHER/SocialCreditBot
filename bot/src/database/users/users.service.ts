import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './create-users.dto';
import { UpdateUserDto } from './update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async getUser(userid: string) {
    return this.prisma.user.findUnique({
      where: { userid },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(userid: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { userid },
      data: updateUserDto,
    });
  }

  async incrementUserSocialCredits(userid: string, incrementBy: number) {
    console.log(userid, incrementBy);
    return this.prisma.user.update({
      where: { userid },
      data: {
        socialcredits: {
          increment: incrementBy,
        },
      },
    });
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
