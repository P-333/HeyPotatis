import { MessageEmbed } from 'discord.js';
import { nothingPlayingEmbed, noVoiceEmbed } from '../MusicQueue';


export default function volume(message: any, serverQueue:any) {

  const args = message.content.split(' ');

  const serverVolumeEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(`🔈 | The server volume is: **${serverQueue.volume}**`)
    .setFooter('Hey Potatis - 2020');
  const invalidAmountEmbed = new MessageEmbed()
    .setColor('RED')
    .setTitle('🚫 | That is not a valid amount to change to.')
    .setFooter('Hey Potatis - 2020');
  const changedVolumeEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(`🔈 | I have changed the server volume to: **${args[1]}**`)
    .setFooter('Hey Potatis - 2020');

  if (!message.member.voice.channel)
    return message.channel.send(
      noVoiceEmbed
    );
  if (!serverQueue)
    return message.channel.send(nothingPlayingEmbed);
  if (!args[1]) return message.channel.send(serverVolumeEmbed);
  if(isNaN(args[1])) return message.channel.send(invalidAmountEmbed);
  serverQueue.volume  = args[1];
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1]);
  message.channel.send(changedVolumeEmbed);
}