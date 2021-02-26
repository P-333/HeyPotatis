import { MessageEmbed } from 'discord.js';
import { queue } from '../MusicUtil/MusicQueue';

export default function generateQueueEmbed(message: any, oneQueue: any) {
  const embeds = [];
  let k = 10;

  for (let i = 0; i < oneQueue.length; i += 10) {
    const current = oneQueue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track: any) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join('\n');

    const serverQueue = queue.get(message.guild!.id);
    const embed = new MessageEmbed()
      .setAuthor('Server Songs Queue')
      .setColor('GREEN')
      .setDescription(`${info}`)
      .addField('Now Playing', `[${oneQueue[0].title}](${oneQueue[0].url})`, true)
      .addField('Text Channel', serverQueue.textChannel, true)
      .addField('Voice Channel', serverQueue.voiceChannel, true)
      .addField('Currently Server Volume is ', serverQueue.volume, true )
      .setFooter('Hey Potatis - 2020');

    embeds.push(embed);
  }

  return embeds;
}