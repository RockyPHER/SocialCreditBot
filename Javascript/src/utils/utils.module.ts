import { Module } from '@nestjs/common';
import { SocialCreditsService } from './socialcredits.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmbedPagesService } from './embedpages.service';
import { ImageService } from './image.service';

@Module({
  imports: [DatabaseModule],
  providers: [SocialCreditsService, EmbedPagesService, ImageService],
  exports: [SocialCreditsService, EmbedPagesService, ImageService],
})
export class UtilsModule {}
