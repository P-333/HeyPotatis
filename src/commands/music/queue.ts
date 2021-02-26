import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import q from '../../MusicUtil/MusicFunctions/Queue';

class Queue extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'queue',
      description: 'Use this to view what is playing',
      usage: '.queue',
      aliases: ['q']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return q(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Queue;
