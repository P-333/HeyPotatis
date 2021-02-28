import { nothingPlayingEmbed, errEmbed } from '../MusicQueue';

export default async function remove(this: any, message: any, serverQueue:any) {
  const args = message.content.split(' ');
  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);
  if (!args.length) return message.channel.send(errEmbed('Invalid use of command. Please insert queue number to remove'));
  if (isNaN(args[1])) return message.channel.send(errEmbed('That is no valid amount.'));
  if (serverQueue.songs.length == 1) return message.channel.send(errEmbed('There is currently no queue'));
  if (args[0] > serverQueue.songs.length) return message.channel.send(errEmbed(`There is currently only ${serverQueue.songs.length} in the queue.`));
  try {
    const song = serverQueue.songs.splice(args[1] - 1, 1);
    message.channel.send(errEmbed(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`)).catch(console.error);
  } catch (error) {
    console.log(error);
    this.client.errHandler(message, error);
    return message.channel.send(errEmbed('ERROR, Please contact @PotatisGrizen#8661'));
  }
}