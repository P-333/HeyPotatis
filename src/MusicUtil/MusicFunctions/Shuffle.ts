import { MessageEmbed } from 'discord.js';
import { errEmbed } from '../MusicQueue';

export default function shuffle(message: any, serverQueue: any) {
  if (!serverQueue) return message.channels.send(errEmbed('There is no queue.')).catch(console.error);
  try {
    const songs = serverQueue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      const j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    serverQueue.songs = songs;
    const shuffleEmbed = new MessageEmbed()
      .setTitle('🔀 | I have shuffled the queue.')
      .setColor('GREEN')
      .setFooter('Hey Potatis - 2020');
    message.channel.send(shuffleEmbed);
  } catch (error) {
    serverQueue.voiceChannel.leave();
    serverQueue.connection.dispatcher.end();
    return message.channel.send(errEmbed(`:notes: The player has stopped and the queue has been cleared.: \`${error}\``));
  }
}