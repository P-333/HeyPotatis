import {Command} from '../../domain/Command';
import {Message} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import {queue} from '../../MusicUtil/MusicQueue';
import resume from '../../MusicUtil/MusicFunctions/Resume';

class Resume extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'resume',
      description: 'Use this to resume the queue',
      usage: '.resume'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return resume(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Resume;
