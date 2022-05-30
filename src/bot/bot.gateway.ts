import { InjectDiscordClient, Once, PrefixCommand } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { GuessService } from './services/guess.service';
import { PokedexService } from './services/pokedex.service';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient() private readonly client: Client,
    private readonly pokedexService: PokedexService,
    private readonly guessService: GuessService,
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @PrefixCommand('pokedex')
  async onMessage(message: Message) {
    const response = await this.pokedexService.pokedexCommand(message);
    const responseString = typeof response === 'string';
    if (responseString) return response;

    return {
      files: [{ attachment: response, name: 'pokemon.png' }],
      content: `Oye, ${message.author}, dime ¿Cuál es este pokemon?`,
      nonce: message.nonce,
    };
  }

  @PrefixCommand('pokemon')
  async onGuess(message: Message) {
    const response = await this.guessService.guessPokemon(message);
    const responseString = typeof response === 'string';
    if (responseString) return response;

    return {
      files: [{ attachment: response, name: 'pokemon.png' }],
      content: `Esooo!!! has acertado! ganas`,
      nonce: message.nonce,
    };
  }
}
