import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), BotModule],
})
export class AppModule {}
