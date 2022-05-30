import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'discord.js';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  pokemonIncorrect,
  pokemonNotPlayingReplies,
  pokemonNotWellFormatted,
} from '../replies/pokemon.replies';
import { RandomReply } from '../util/random-message.util';
import { PokepyonCommand } from './commands/pokedex.command';
import { QuestionsService } from './questions.service';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly questionsService: QuestionsService,
  ) {}

  async guessPokemon(message: Message) {
    const { content } = message;
    const command = new PokepyonCommand(message);
    const user = await this.getUser(command);
    const userIsPlaying = await this.questionsRepository.findOne({
      where: {
        user,
      },
    });
    if (!userIsPlaying)
      return new RandomReply(pokemonNotPlayingReplies).finalMessage;

    const contentValid = this.validateContent(content);
    if (!contentValid)
      return new RandomReply(pokemonNotWellFormatted).finalMessage;

    const guess = content.toLowerCase();
    const question = await this.questionsRepository.find({
      where: {
        user,
        answer: guess,
      },
    });
    if (!question.length) {
      return new RandomReply(pokemonIncorrect).finalMessage;
    }

    return 'ahuevos';
  }

  private validateContent(content: string) {
    const thereIsContent = !!content.length;
    const isJustOneWord = content.split(' ').length === 1;
    return thereIsContent && isJustOneWord;
  }

  private async getUser(command: PokepyonCommand) {
    const user = await this.usersRepository.findOne({
      where: {
        discordUserId: command.userId,
        serverId: command.guildId,
      },
    });
    return user;
  }
}
