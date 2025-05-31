import { Module } from '@nestjs/common';
import { SocialCreditsService } from './socialcredits.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmbedPagesService } from './embedpages.service';

@Module({
  imports: [DatabaseModule],
  providers: [SocialCreditsService, EmbedPagesService],
})
export class UtilsModule {}
