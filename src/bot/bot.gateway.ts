import { InjectDiscordClient, Once, PrefixCommand } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { PokedexService } from './services/pokedex.service';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient() private readonly client: Client,
    private readonly pokedexService: PokedexService,
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
}
