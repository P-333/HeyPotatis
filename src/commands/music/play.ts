import {Command} from '../../domain/Command';
import {Message, MessageEmbed} from 'discord.js';
import {PGClient} from '../../domain/PGClient';
import execute from '../../MusicUtil/MusicFunctions/Execute';

class Play extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'play',
      description: 'Use this to add a song to the queue',
      usage: '.play',
      aliases: ['p']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  run(message: Message, args: Array<string>) {
    try {
      const noUrl = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('You have not specified an url for me to play.')
        .setFooter('Hey Potatis - 2020');
      if (args[0] == null) {
        return message.channel.send(noUrl);
      }
      return execute(message);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Play;
