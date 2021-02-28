import { queue, noVoiceEmbed } from '../MusicQueue';

export default function stop(message: any, serverQueue: any) {
  if (!message.member.voice.channel) {
    serverQueue.connection.dispatcher.end();
    queue.delete(message.guild.id);
    return message.channel.send(noVoiceEmbed);
  }
  if (!serverQueue) {
    message.guild.me.voice.channel.leave(); 
  }
  else {
    serverQueue.connection.dispatcher.end();
    serverQueue.voiceChannel.leave();
    message.guild.me.voice.channel.leave(); 
    queue.delete(message.guild.id);
  }
}