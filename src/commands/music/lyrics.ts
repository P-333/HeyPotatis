import { Command } from '../../domain/Command';
import { Message } from 'discord.js';
import { PGClient } from '../../domain/PGClient';
import { queue } from '../../MusicUtil/MusicQueue';
import lyrics from '../../MusicUtil/MusicFunctions/Lyrics';

class Lyrics extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'lyrics',
      description: 'Get the lyrics of the song',
      usage: '.lyrics'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return lyrics(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Lyrics;