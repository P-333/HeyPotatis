import { MessageEmbed } from 'discord.js';
import { nothingPlayingEmbed } from '../MusicQueue';

export default function loop(message: any, serverQueue:any) {

  const loopEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setDescription(`🔁 | The loop function is now ${serverQueue.loop ? '**Disabled**' : '**Enabled**'}`)
    .setFooter('Hey Potatis - 2020');
  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

  serverQueue.loop = !serverQueue.loop;
  message.channel.send(loopEmbed);
}