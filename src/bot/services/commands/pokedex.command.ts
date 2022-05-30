import { Message } from 'discord.js';

export class PokepyonCommand {
  guildId: string;
  userId: string;

  constructor(message: Message) {
    this.guildId = message.guildId;
    this.userId = message.author.id;
  }
}
