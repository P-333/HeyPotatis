import {MessageEmbed} from 'discord.js';
import * as ytdl from 'ytdl-core';
import {queue} from '../MusicQueue';

export default async function play(guild: any, song: any) {

  const serverQueue = queue.get(guild.id);
  if (!song) {
    return setTimeout(() => {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
    }, 30 * 60 * 1000);
  }

  let stream = null;
  if (song.url.includes('youtube.com')) {

    stream = await ytdl(song.url);
    stream.on('error', function (err: string) {
      if (err) {
        if (serverQueue) {
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        }
      }
    });
  } else if (song.url.includes('spotify.com')) {
    stream = await ytdl(song.url);
    stream.on('error', function (err: string) {
      if (err) {
        if (serverQueue) {
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        }
      }
    });
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1 << 25}))
    .on('finish', () => {
      if(!serverQueue.loop) serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    });
  const startedPlayingEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(`▶ | Started playing: **${song.title}**`)
    .addField('Duration', song.duration, true)
    .addField('Requested by', song.req.tag, true)
    .addField('Url', song.url, true )
    .setFooter('Hey Potatis - 2020');
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
  serverQueue.textChannel.send(startedPlayingEmbed);
}