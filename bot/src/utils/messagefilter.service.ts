import { Injectable } from '@nestjs/common';
import { BrainJSService } from './brainjs/brainjs.service';
import { UsersService } from 'src/database/users/users.service';

@Injectable()
export class MessageFilter {
  constructor(
    private readonly brainJSService: BrainJSService,
    private readonly usersService: UsersService,
  ) {}
  async rateSocialCredits(message: string, userid: string) {
    const newSocialCredits = await this.brainJSService.rateSentiment(message);
    await this.usersService.incrementUserSocialCredits(
      userid,
      newSocialCredits,
    );
  }
  //   async rateBigFive(message: string, userid: string) {
  //     const newUserBigFive = this.brainJSService.rateBigFive(message);

  //     await this.usersService.updateUser(userid, newUserBigFive);
  //   }
}
