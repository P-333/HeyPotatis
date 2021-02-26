import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import stop from '../../MusicUtil/MusicFunctions/Stop';

class Stop extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'stop',
      description: 'Use this to stop the music queue',
      usage: '.stop',
      aliases: ['leave']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return stop(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Stop;
