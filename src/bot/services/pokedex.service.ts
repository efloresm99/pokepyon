import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'discord.js';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { pokedexReplies } from '../replies/pokedex.replies';
import { RandomReply } from '../util/random-message.util';
import { PokepyonCommand } from './commands/pokedex.command';
import { QuestionsService } from './questions.service';

@Injectable()
export class PokedexService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly questionsService: QuestionsService,
  ) {}

  async pokedexCommand(message: Message) {
    const command = new PokepyonCommand(message);
    const user = await this.upsertUser(command);
    const activeQuestions = await this.getActiveQuestions(user);
    const userHasUnansweredQuestion = !!activeQuestions;
    if (userHasUnansweredQuestion)
      return new RandomReply(pokedexReplies).finalMessage;

    const lastAsked = user.askedOn;
    const lastAskedDate = new Date(lastAsked.toString());
    const userPlayedToday = this.isToday(lastAskedDate);
    console.log(userPlayedToday);
    if (userPlayedToday) return 'Eeh ya habias jugado hoy.';

    return await this.questionsService.getQuestion(user);
  }

  private async getActiveQuestions(user: User) {
    const activeQuestions = await this.questionsRepository.findOne({
      where: {
        user,
      },
    });
    return activeQuestions;
  }

  private async upsertUser(command: PokepyonCommand) {
    const { userId, guildId } = command;
    const user = await this.usersRepository.findOne({
      where: {
        discordUserId: userId,
        serverId: guildId,
      },
    });
    if (!user) {
      const userObj = {
        serverId: guildId,
        discordUserId: userId,
        currentPoints: 0,
        totalPoints: 0,
        askedOn: null,
      };
      const newUser = this.usersRepository.create(userObj);
      return await this.usersRepository.save(newUser);
    }
    return user;
  }

  private isToday(someDate: Date) {
    const today = new Date();
    return (
      someDate.getUTCDate() === today.getUTCDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  }
}
