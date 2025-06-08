import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { BotModule } from './bot/bot.module';
import { AppController } from './app.controller';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './database/database.module';
import { UtilsModule } from './utils/utils.module';
import { HttpModule } from '@nestjs/axios';
dotenv.config();

@Module({
  imports: [
    NecordModule.forRoot({
      token: String(process.env.DISCORD_TOKEN),
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
    }),
    BotModule,
    DatabaseModule,
    UtilsModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
