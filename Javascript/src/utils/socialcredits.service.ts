import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SocialCreditsService {
  constructor(private readonly prisma: PrismaService) {}

  async scoreMessage(userid: string, message: string) {
    console.log('Scoring message:', { userid, message });

    const badWords = ['taiwan', 'eua', 'peroka', 'buceta'];
    const goodWords = ['china', 'obrigado', 'feliz'];

    const msg = message.toLowerCase();

    let score = 0;

    for (const word of goodWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = msg.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    for (const word of badWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = msg.match(regex);
      if (matches) {
        score -= matches.length;
      }
    }

    await this.incrementSocialCredits(userid, score);

    return score;
  }

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
}
