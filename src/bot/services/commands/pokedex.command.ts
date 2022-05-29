import { Message } from 'discord.js';

export class PokedexCommand {
  guildId: string;
  userId: string;

  constructor(message: Message) {
    this.guildId = message.guildId;
    this.userId = message.author.id;
  }
}
