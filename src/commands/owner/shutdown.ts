import { Command } from '../../domain/Command';
import { Message } from 'discord.js';
import { PGClient } from '../../domain/PGClient';

class Shutdown extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'shutdown',
      description: 'A shutdown command for the bot. Owner only',
      usage: '.shutdown'
    });
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message) {
    if(message.member?.id == '196245585945165824') return;
    message.client.users.cache.get('196245585945165824')?.send('Restarting the bot.');
    process.exit();
  }

}

export = Shutdown;
