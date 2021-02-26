import { MessageEmbed } from 'discord.js';
import { nothingPlayingEmbed, errEmbed } from '../MusicQueue';
import { getLyrics } from 'genius-lyrics-api';

export default async function lyrics(this: any, message: any, serverQueue:any) {

  const fullName = serverQueue.songs[0].title;
  const artist = fullName.slice(0, fullName.indexOf(' -'));
  const title = fullName.slice(fullName.indexOf(' -'), fullName.length);

  const options = {
    apiKey: process.env.GENIUS_TOKEN as string,
    title: title,
    artist: artist,
    optimizeQuery: true
  };

  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

  try {
    getLyrics(options).then((lyrics: any) =>  {
      const lyricsEmbed = new MessageEmbed()
        .setTitle(fullName)
        .setColor('GREEN')
        .setDescription(`\n${lyrics}\n\n**${artist}**`)
        .setFooter('Hey Potatis - 2020');

      message.channel.send(lyricsEmbed);
    });
  } catch (error) {
    console.log(error);
    message.channel.send(errEmbed('ERROR, Please contact @PotatisGrizen#8661'));
    this.client.errHandler(message, error);
  }

}