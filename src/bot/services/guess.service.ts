import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Message } from 'discord.js';
import * as sharp from 'sharp';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  pokemonCorrect,
  pokemonIncorrect,
  pokemonNotPlayingReplies,
  pokemonNotWellFormatted,
} from '../replies/pokemon.replies';
import { RandomReply } from '../util/random-message.util';
import { PokepyonCommand } from './commands/pokedex.command';
import { QuestionsService } from './questions.service';
import { firstUpper } from '../util/first-upper.util';
import { Hint } from 'src/entities/hint.entity';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Hint) private readonly hintsRepository: Repository<Hint>,
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
    const question = await this.questionsRepository.findOne({
      where: {
        user,
        answer: guess,
      },
    });
    if (!question) {
      const question = await this.questionsRepository.findOne({
        where: {
          user,
        },
      });
      return await this.getReply(question, user, false);
    }

    return await this.getReply(question, user);
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

  private async getPokemonImage(imageUrl: string) {
    const image = (await axios({ url: imageUrl, responseType: 'arraybuffer' }))
      .data as Buffer;
    const background = (
      await axios({
        url: process.env.BACKGROUND_URL,
        responseType: 'arraybuffer',
      })
    ).data as Buffer;
    const processedImage = await sharp(image).resize(null, 180).toBuffer();
    const finalImage = sharp(background)
      .composite([{ input: processedImage, top: 40, left: 40 }])
      .toBuffer();
    return finalImage;
  }

  private async getReply(question: Question, user: User, success = true) {
    const { answer } = question;
    const pokemonRevealed = await this.getPokemonImage(question.imageUrl);
    await this.hintsRepository.delete({ question });
    await this.questionsRepository.delete({ user });

    if (!success) {
      const randomReply = `${
        new RandomReply(pokemonIncorrect).finalMessage
      } La respuesta era: **${firstUpper(answer)}**!!`;
      return { content: randomReply, attachment: pokemonRevealed };
    }

    const randomReply = `${
      new RandomReply(pokemonCorrect).finalMessage
    } La respuesta es: **${firstUpper(answer)}**!!`;
    return { content: randomReply, attachment: pokemonRevealed };
  }
}
