import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import shuffle from '../../MusicUtil/MusicFunctions/Shuffle';

class Shuffle extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'shuffle',
      description: 'Shuffle the queue',
      usage: '.loop'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return shuffle(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Shuffle
