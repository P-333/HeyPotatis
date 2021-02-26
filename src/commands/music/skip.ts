import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import skip from '../../MusicUtil/MusicFunctions/Skip';

class Skip extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'skip',
      description: 'Use this skip a song in the music queue',
      usage: '.skip',
      aliases: ['s']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return skip(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Skip;
