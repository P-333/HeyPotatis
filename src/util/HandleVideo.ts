import {MessageEmbed} from 'discord.js';
import { queue } from '../MusicUtil/MusicQueue';
import play from '../MusicUtil/MusicFunctions/Play';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function handleVideo(song: any, message: any, channel: any, playlist: boolean) {
  const serverQueue = queue.get(message.guild?.id);
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 80,
      playing: true,
      loop: false
    };

    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song as never);

    try {
      const connection = await channel.join();
      await connection.voice.setSelfDeaf(true).then(connection.voice.setDeaf(true));
      queueConstruct.connection = connection;
      await play(message.guild, queueConstruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    if (playlist) return;
    const addedToQueueEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(`✅ | ${song.title} has been added to the queue!`)
      .addField('Duration', song.duration, true)
      .addField('Requested by', song.req.tag, true)
      .setFooter('Hey Potatis - 2020');
    return message.channel.send(addedToQueueEmbed);
  }
}