import { Message } from 'discord.js';
import { PGClient } from './PGClient';

interface CommandData{
    name: string;
    aliases?: Array<string>;
    usage?: string;
    description: string;
}

class Command {

    readonly client: PGClient;

    readonly name: string;
    readonly aliases: Array<string>;
    readonly usage: string;
    readonly description: string;

    constructor(client: PGClient, data: CommandData) {

      this.client = client;

      this.name = data.name;

      this.aliases = data.aliases ?? [];
      this.usage = data.usage ?? 'N/A';

      this.description = data.description;

    }

    public run(message: Message, args: string[]): void {
      throw new Error('Methods not implemented.');
    }

}

export { Command };