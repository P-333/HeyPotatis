import { MessageEmbed } from 'discord.js';
import { nothingPlayingEmbed } from '../MusicQueue';

export default function resume(message: any, serverQueue:any) {

  const resumedEmbed = new MessageEmbed()
    .setTitle('▶ | I have resumed the queue.')
    .setColor('GREEN')
    .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
    .setFooter('Hey Potatis - 2020');

  const alreadyPlayingEmbed = new MessageEmbed()
    .setTitle('▶ | The queue is not paused')
    .setColor('GREEN')
    .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
    .setFooter('Hey Potatis - 2020');
  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);
  if (serverQueue.playing) return message.channel.send(alreadyPlayingEmbed);
  serverQueue.playing = true;
  serverQueue.connection.dispatcher.resume();
  message.channel.send(resumedEmbed);
}