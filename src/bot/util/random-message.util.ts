export class RandomReply {
  possibleMessages: string[];
  finalMessage: string;
  constructor(possibleMessages: string[]) {
    this.possibleMessages = possibleMessages;
    this.getRandomMessage();
  }

  getRandomMessage() {
    const upperLimit = this.possibleMessages.length;
    const index = Math.floor(Math.random() * upperLimit);
    this.finalMessage = this.possibleMessages[index];
  }
}
