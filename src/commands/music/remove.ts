import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import remove from '../../MusicUtil/MusicFunctions/Remove';

class Remove extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'remove',
      description: 'Remove a song from the queue',
      usage: '.remove [number]'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return remove(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Remove;
