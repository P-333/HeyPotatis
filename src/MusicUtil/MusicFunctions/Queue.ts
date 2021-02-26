import { errEmbed } from '../MusicQueue';
import generateQueueEmbed from '../../util/GenerateQueueEmbed';

export default async function q(message: any, serverQueue:any) {

  const permissions = message.channel.permissionsFor(message.client.user);
  if (!permissions.has(['MANAGE_MESSAGES', 'ADD_REACTIONS']))
    return message.channel.send(errEmbed('Missing permission to manage messages or add reactions'));

  const queue = serverQueue;
  if (!queue) return message.channel.send(errEmbed('There is nothing playing in this server.'));

  let currentPage = 0;
  const embeds = generateQueueEmbed(message, queue.songs);

  const queueEmbed = await message.channel.send(
    `**\`${currentPage + 1}\`**/**${embeds.length}**`,
    embeds[currentPage]
  );

  try {
    await queueEmbed.react('◀');
    await queueEmbed.react('🛑');
    await queueEmbed.react('▶');
  } catch (error) {
    console.error(error);
    message.channel.send(error.message).catch(console.error);
  }

  const filter = (reaction: any) =>
    ['◀', '🛑', '▶'].includes(reaction.emoji.name);
  const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

  collector.on('collect', async (reaction: any) => {
    try {
      if (reaction.emoji.name === '▶') {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
        }
      } else if (reaction.emoji.name === '◀') {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
        }
      } else {
        collector.stop();
        await reaction.message.reactions.removeAll();
      }
      await reaction.users.remove(message.author.id);
    } catch (error) {
      console.error(error);
      return message.channel.send(error.message).catch(console.error);
    }
  });
}