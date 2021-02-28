import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import pause from '../../MusicUtil/MusicFunctions/Pause';

class Pause extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'pause',
      description: 'Use this to pause the queue',
      usage: '.pause'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return pause(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Pause;
