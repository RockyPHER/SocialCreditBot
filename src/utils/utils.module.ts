import { Module } from '@nestjs/common';
import { SocialCreditsService } from './socialcredits.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SocialCreditsService],
})
export class UtilsModule {}
