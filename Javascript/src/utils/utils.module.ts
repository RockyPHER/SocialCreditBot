import { Module } from '@nestjs/common';
import { SocialCreditsService } from './socialcredits.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmbedPagesService } from './embedpages.service';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';
import { MessageFilter } from './messagefilter.service';
import { BrainJSService } from './brainjs/brainjs.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [
    SocialCreditsService,
    EmbedPagesService,
    ImageService,
    MessageFilter,
    BrainJSService,
  ],
  exports: [
    SocialCreditsService,
    EmbedPagesService,
    ImageService,
    MessageFilter,
  ],
})
export class UtilsModule {}
