import { Util } from 'discord.js';
import * as ytdl from 'ytdl-core';
import {search} from 'yt-search';
import * as ytpl from 'ytpl';
import { noPermissionEmbed, noVoiceEmbed, errEmbed } from '../MusicQueue';
import handleVideo from '../../util/HandleVideo';


export default async function execute(this: any, message: any) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      noVoiceEmbed
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send(
      noPermissionEmbed
    );
  }

  const searchString = args.join(' ');
  if (!searchString)return message.channel.send(errEmbed('You didn\'t provide a search term.'));
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

  let song = {
    id: '',
    title: '',
    url: '',
    views: '',
    duration: '',
    req: ('' as any)
  };

  if (url.match(/(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^?&"'<> #]+)/)) {
    try {
      const songInfo = await ytdl.getInfo(url);
      if (!songInfo) return message.channel.send(errEmbed('Nothing found on that url'));
      song = {
        id: songInfo.videoDetails.videoId,
        title: Util.escapeMarkdown(songInfo.videoDetails.title),
        url: songInfo.videoDetails.video_url,
        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
        duration: songInfo.videoDetails.lengthSeconds,
        req: message.author
      };
      await handleVideo(song, message, voiceChannel, false);
    } catch (error) {
      console.log(error);
      message.channel.send(errEmbed('ERROR, Please contact @PotatisGrizen#8661'));
      this.client.errHandler(message, error);
    }
  } else if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
    try {
      const id = ytpl.getPlaylistID(url);
      const playlist = await ytpl(await id);
      if (!playlist) return message.channel.send(errEmbed('Could not find that playlist'));
      const videos = playlist.items;
      for (const video of videos) {
        song = {
          id: video.id,
          title: Util.escapeMarkdown(video.title),
          views: 'N/A',
          url: video.url,
          duration: video.duration as string,
          req: message.author
        };
        await handleVideo(song, message, voiceChannel, true);
      }
      return message.channel.send({
        embed: {
          color: 'GREEN',
          description: `✅ | Playlist: **\`${url}\`** has been added to the queue`
        }
      });
    } catch (error) {
      console.log(error);
      message.channel.send(errEmbed('ERROR, Please contact @PotatisGrizen#8661'));
      this.client.errHandler(message, error);
    }
  } else if (url.match(/^https?:\/\/(open.spotify.com)\/track(.*)$/)) {
    // https://open.spotify.com/track/7ce20yLkzuXXLUhzIDoZih?si=HyjlsNuuSzOiStWN1dCyyw
    const id = url.toString()
      .split('/')
      .splice(4, 1)
      .join('/')
      .split('?')
      .splice(0, 1)
      .join('?');
    console.log(id);

  } else if (url.match(/^https?:\/\/(open.spotify.com)\/playlist(.*)$/)) {
    //https://open.spotify.com/playlist/7IyhkbeZ6g0awowEPYZbHW?si=ztiG0N1ySiC02raDIugyQQ
  } else {
    try {
      const searched = await search(searchString);
      if (searched.videos.length === 0) return message.channel.send(errEmbed('Nothing found on that search term'));
      const songInfo = searched.videos[1];
      song = {
        id: songInfo.videoId,
        title: Util.escapeMarkdown(songInfo.title),
        url: songInfo.url,
        views: String(songInfo.views).padStart(10, ' '),
        duration: songInfo.duration.toString(),
        req: message.author
      };
      await handleVideo(song, message, voiceChannel, false);
    } catch (error) {
      console.log(error);
      message.channel.send(errEmbed('ERROR, Please contact @PotatisGrizen#8661'));
      this.client.errHandler(message, error);
    }
  }
}