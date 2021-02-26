import { Command } from '../../domain/Command';
import { Message } from 'discord.js';
import { PGClient } from '../../domain/PGClient';
import { queue } from '../../MusicUtil/MusicQueue';
import loop from '../../MusicUtil/MusicFunctions/Loop';

class Loop extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'loop',
      description: 'Toggle the loop function',
      usage: '.loop'
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    try {
      const serverQueue = queue.get(message.guild?.id);
      return loop(message, serverQueue);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Loop
