import { Module } from '@nestjs/common';
import { SocialCreditsService } from './socialcredits.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmbedPagesService } from './embedpages.service';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [SocialCreditsService, EmbedPagesService, ImageService],
  exports: [SocialCreditsService, EmbedPagesService, ImageService],
})
export class UtilsModule {}
