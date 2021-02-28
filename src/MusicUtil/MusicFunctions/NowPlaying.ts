import {MessageEmbed} from 'discord.js';
import {nothingPlayingEmbed, queue} from '../MusicQueue';

export default function np(message: any, serverQueue: any) {
  console.log(queue)

  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

  const nowPlayingEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(`**Now playing:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
      .setFooter('Hey Potatis - 2020');
  message.channel.send(nowPlayingEmbed);
}