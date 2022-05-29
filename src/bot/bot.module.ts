import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hint } from 'src/entities/hint.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { Question } from 'src/entities/question.entity';
import { Store } from 'src/entities/store.entity';
import { User } from 'src/entities/user.entity';
import { BotGateway } from './bot.gateway';
import { PokedexService } from './services/pokedex.service';
import { QuestionsService } from './services/questions.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    TypeOrmModule.forFeature([Hint, Purchase, Question, Store, User]),
  ],
  providers: [BotGateway, PokedexService, QuestionsService],
})
export class BotModule {}
