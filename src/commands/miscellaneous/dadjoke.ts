import { Command } from '../../domain/Command';
import { Message, MessageEmbed } from 'discord.js';
import { PGClient } from '../../domain/PGClient';
import fetch from 'node-fetch';

class Dadjoke extends Command {

  constructor(client: PGClient) {
    super(client, {
      name: 'dad',
      description: 'Använd detta kommando för att skicka ut ett dadjoke',
      usage: '.dad',
      aliases: ['daddy', 'dadjoke']
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async run(message: Message) {
    try {
      const { joke } = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET',
      }).then(response => response.json());
      const dadJokeEmbed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle(`${joke}`);
      return message.channel.send(dadJokeEmbed);
    } catch (err) {
      this.client.errHandler(message, err);
    }
  }
}
export = Dadjoke;
