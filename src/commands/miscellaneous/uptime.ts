import { Command } from '../../domain/Command';
import { Message, MessageEmbed } from 'discord.js';
import { PGClient } from '../../domain/PGClient';

class Uptime extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'uptime',
      description: 'Använd detta kommando för att se uptime av botten',
      usage: '.uptime'
    });
  }

  run(message: Message) {
    try {
      // eslint-disable-next-line no-inner-declarations
      function duration(ms: any) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24)).toString();
        return `${days.padStart(1, '0')} d, ${hrs.padStart(2, '0')} h, ${min.padStart(2, '0')} min, ${sec.padStart(2, '0')} sek`;
      }

      const Uptime: MessageEmbed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle('Uptime')
        .setDescription(`Jag har varit uppe i: ${duration(this.client.uptime)}`);
      message.channel.send(Uptime).then(msg => {
        if (msg.deletable) return msg.delete({timeout: 20000});
      });
      if (message.deletable) return message.delete();
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }

}

export = Uptime;
