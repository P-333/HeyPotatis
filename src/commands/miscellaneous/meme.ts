import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';

class Meme extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'meme',
      description: 'A meme command',
      usage: '.meme'
    });
  }
  
  // eslint-disable-next-line 
  run(message: Message, args: Array<string>) {
    message.channel.send('Out of order!');
  }

}

export = Meme;
