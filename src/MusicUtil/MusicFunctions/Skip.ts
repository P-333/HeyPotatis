import {nothingPlayingEmbed, noVoiceEmbed} from '../MusicQueue';

export default function skip(message: any, serverQueue: any) {
  if (!message.member.voice.channel)
    return message.channel.send(
      noVoiceEmbed
    );
  if (!serverQueue)
    return message.channel.send(nothingPlayingEmbed);
  serverQueue.connection.dispatcher.end();
}