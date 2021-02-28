import { MessageEmbed } from 'discord.js';
import { nothingPlayingEmbed } from '../MusicQueue';

export default function pause(message: any, serverQueue:any) {

  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

  const pausedEmbed = new MessageEmbed()
    .setTitle('⏸ | I have paused the queue.')
    .setColor('GREEN')
    .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
    .setFooter('Hey Potatis - 2020');

  const alreadyPausedEmbed = new MessageEmbed()
    .setTitle('⏸ | The queue is already paused')
    .setColor('GREEN')
    .setDescription(`**The queue is paused on song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
    .setFooter('Hey Potatis - 2020');
  if (!serverQueue.playing) return message.channel.send(alreadyPausedEmbed);
  serverQueue.playing = false;
  serverQueue.connection.dispatcher.pause();
  message.channel.send(pausedEmbed);
}