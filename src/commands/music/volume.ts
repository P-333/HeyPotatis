import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import volume from '../../MusicUtil/MusicFunctions/Volume';

class Volume extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'volume',
      description: 'Use this to change the volume',
      usage: '.volume',
      aliases: ['v']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return volume(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Volume;
