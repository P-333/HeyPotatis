import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import np from '../../MusicUtil/MusicFunctions/NowPlaying';

class Np extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'np',
      description: 'Use this to view what is playing',
      usage: '.np',
      aliases: ['nowplaying']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return np(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Np;
