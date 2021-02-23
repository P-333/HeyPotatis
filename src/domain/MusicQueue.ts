import {Channel, MessageEmbed, Util} from 'discord.js';
import * as ytdl from 'ytdl-core'
import {search} from 'yt-search'
import {getLyrics} from 'genius-lyrics-api';
import * as ytpl from 'ytpl';

const queue = new Map();

    const noVoiceEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("🚫 | You are currently not in a voice channel. Please join one before the use of music commands.")
      .setFooter("Hey Potatis - 2020");

    const noPermissionEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("🚫 | I need the permission to join and speak in your voice channel!")
      .setFooter("Hey Potatis - 2020");

    const nothingPlayingEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle("There is no music playing right now")
      .setFooter("Hey Potatis - 2020");

    const errEmbed = (msg: string) => {
      return new MessageEmbed()
          .setTitle(msg)
          .setColor("RED")
          .setFooter("Hey Potatis - 2020")
    }

  async function execute(this: any, message: any) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        noVoiceEmbed
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        noPermissionEmbed
      );
    }

    let searchString = args.join(" ");
    if (!searchString)return message.channel.send(errEmbed("You didn't provide a search term."));
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";

    let song = {
      id: "",
      title: "",
      url: "",
      views: "",
      duration: "",
      req: ("" as any)
    };

    if (url.match(/(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^?&"'<> #]+)/)) {
        try {
          const songInfo = await ytdl.getInfo(url)
          if (!songInfo) return message.channel.send(errEmbed("Nothing found on that url"))
          song = {
            id: songInfo.videoDetails.videoId,
            title: Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url,
            views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
            duration: songInfo.videoDetails.lengthSeconds,
            req: message.author
          }
          await handleVideo(song, message, voiceChannel, false)
        } catch (error) {
          console.log(error);
          message.channel.send(errEmbed("ERROR, Please contact @PotatisGrizen#8661"));
          this.client.errHandler(message, error);
        }
    } else if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
      try {
        const id = ytpl.getPlaylistID(url);
        const playlist = await ytpl(await id);
        if (!playlist) return message.channel.send(errEmbed("Could not find that playlist"));
        const videos = playlist.items;
        for (const video of videos) {
          song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            views: "N/A",
            url: video.url,
            duration: video.duration as string,
            req: message.author
          }
          await handleVideo(song, message, voiceChannel, true)
        }
        return message.channel.send({
          embed: {
            color: "GREEN",
            description: `✅ | Playlist: **\`${url}\`** has been added to the queue`
          }
        })
      } catch (error) {
        console.log(error);
        message.channel.send(errEmbed("ERROR, Please contact @PotatisGrizen#8661"));
        this.client.errHandler(message, error);
      }
    } else if (url.match(/^https?:\/\/(open.spotify.com)\/track(.*)$/)) {
      // https://open.spotify.com/track/7ce20yLkzuXXLUhzIDoZih?si=HyjlsNuuSzOiStWN1dCyyw
      const id = url.toString()
          .split("/")
          .splice(4, 1)
          .join("/")
          .split("?")
          .splice(0, 1)
          .join("?");
      console.log(id);

    } else if (url.match(/^https?:\/\/(open.spotify.com)\/playlist(.*)$/)) {
      //https://open.spotify.com/playlist/7IyhkbeZ6g0awowEPYZbHW?si=ztiG0N1ySiC02raDIugyQQ
    } else {
      try {
        let searched = await search(searchString);
        if (searched.videos.length === 0) return message.channel.send(errEmbed("Nothing found on that search term"));
        const songInfo = searched.videos[1]
        song = {
          id: songInfo.videoId,
          title: Util.escapeMarkdown(songInfo.title),
          url: songInfo.url,
          views: String(songInfo.views).padStart(10, ' '),
          duration: songInfo.duration.toString(),
            req: message.author
          }
          await handleVideo(song, message, voiceChannel, false)
        } catch (error) {
          console.log(error);
          message.channel.send(errEmbed("ERROR, Please contact @PotatisGrizen#8661"));
          this.client.errHandler(message, error);
        }
    }
  }

  async function handleVideo(song: any, message: any, channel: any, playlist: boolean) {
      const serverQueue = queue.get(message.guild!.id);
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
        let connection: any;
        connection = await channel.join();
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
            .setColor("GREEN")
            .setTitle(`✅ | ${song.title} has been added to the queue!`)
            .addField("Duration", song.duration, true)
            .addField("Requested by", song.req.tag, true)
            .setFooter("Hey Potatis - 2020");
        return message.channel.send(addedToQueueEmbed);
    }
  }

  function skip(message: any, serverQueue: any) {
    if (!message.member.voice.channel)
      return message.channel.send(
        noVoiceEmbed
      );
    if (!serverQueue)
      return message.channel.send(nothingPlayingEmbed);
    serverQueue.connection.dispatcher.end();
  }

  function stop(message: any, serverQueue: any) {
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

  async function play(guild: any, song: any) {

    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    let stream = null;
    if (song.url.includes("youtube.com")) {

      stream = await ytdl(song.url);
      stream.on('error', function (err: string) {
        if (err) {
          if (serverQueue) {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
          }
        }
      });
    } else if (song.url.includes("spotify.com")) {
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
      .on("finish", () => {
        if(!serverQueue.loop) serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      });
       const startedPlayingEmbed = new MessageEmbed()
         .setColor("GREEN")
         .setTitle(`▶ | Started playing: **${song.title}**`)
         .addField("Duration", song.duration, true)
         .addField("Requested by", song.req.tag, true)
         .addField("Url", song.url, true )
         .setFooter("Hey Potatis - 2020");
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    serverQueue.textChannel.send(startedPlayingEmbed);
  }

  function volume(message: any, serverQueue:any) {

    const args = message.content.split(" ");

    const serverVolumeEmbed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`🔈 | The server volume is: **${serverQueue.volume}**`)
    .setFooter("Hey Potatis - 2020");
    const invalidAmountEmbed = new MessageEmbed()
    .setColor("RED")
    .setTitle("🚫 | That is not a valid amount to change to.")
    .setFooter("Hey Potatis - 2020");
    const changedVolumeEmbed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`🔈 | I have changed the server volume to: **${args[1]}**`)
    .setFooter("Hey Potatis - 2020");

    if (!message.member.voice.channel)
      return message.channel.send(
        noVoiceEmbed
      );
    if (!serverQueue)
    return message.channel.send(nothingPlayingEmbed);
    if (!args[1]) return message.channel.send(serverVolumeEmbed);
    if(isNaN(args[1])) return message.channel.send(invalidAmountEmbed);
    serverQueue.volume  = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1]);
    message.channel.send(changedVolumeEmbed)
  }

  function np(message: any, serverQueue:any) {

    if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

    const nowPlayingEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`**Now playing:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
      .setFooter("Hey Potatis - 2020");
    message.channel.send(nowPlayingEmbed);
  }

  async function q(message: any, serverQueue:any) {

    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return message.channel.send(errEmbed("Missing permission to manage messages or add reactions"));

    const queue = serverQueue;
    if (!queue) return message.channel.send(errEmbed("There is nothing playing in this server."));

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, queue.songs);

    const queueEmbed = await message.channel.send(
        `**\`${currentPage + 1}\`**/**${embeds.length}**`,
        embeds[currentPage]
    );

    try {
      await queueEmbed.react("◀");
      await queueEmbed.react("🛑");
      await queueEmbed.react("▶");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction: any) =>
        ["◀", "🛑", "▶"].includes(reaction.emoji.name);
    const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

    collector.on("collect", async (reaction: any) => {
      try {
        if (reaction.emoji.name === "▶") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**\`${currentPage + 1}\`**/**${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === "◀") {
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

  function generateQueueEmbed(message: any, oneQueue: any) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < oneQueue.length; i += 10) {
      const current = oneQueue.slice(i, k);
      let j = i;
      k += 10;

      const info = current.map((track: any) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`).join("\n");

      const serverQueue = queue.get(message.guild!.id)
      const embed = new MessageEmbed()
          .setAuthor("Server Songs Queue")
          .setColor("GREEN")
          .setDescription(`${info}`)
          .addField("Now Playing", `[${oneQueue[0].title}](${oneQueue[0].url})`, true)
          .addField("Text Channel", serverQueue.textChannel, true)
          .addField("Voice Channel", serverQueue.voiceChannel, true)
          .addField("Currently Server Volume is ", serverQueue.volume, true )
          .setFooter("Hey Potatis - 2020")

      embeds.push(embed);
    }

    return embeds;
  }

  function pause(message: any, serverQueue:any) {

    const pausedEmbed = new MessageEmbed()
      .setTitle("⏸ | I have paused the queue.")
      .setColor("GREEN")
      .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
      .setFooter("Hey Potatis - 2020");

    const alreadyPausedEmbed = new MessageEmbed()
      .setTitle("⏸ | The queue is already paused")
      .setColor("GREEN")
      .setDescription(`**The queue is paused on song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
      .setFooter("Hey Potatis - 2020");
    if (!serverQueue) return message.channel.send(nothingPlayingEmbed);
    if (!serverQueue.playing) return message.channel.send(alreadyPausedEmbed);
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    message.channel.send(pausedEmbed);
  }

  function resume(message: any, serverQueue:any) {

    const resumedEmbed = new MessageEmbed()
      .setTitle("▶ | I have resumed the queue.")
      .setColor("GREEN")
      .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
      .setFooter("Hey Potatis - 2020");

    const alreadyPlayingEmbed = new MessageEmbed()
      .setTitle("▶ | The queue is not paused")
      .setColor("GREEN")
      .setDescription(`**Current song:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | \`${serverQueue.songs[0].duration} Requested by: ${serverQueue.songs[0].req.tag}\``)
      .setFooter("Hey Potatis - 2020");
    if (!serverQueue) return message.channel.send(nothingPlayingEmbed);
    if (serverQueue.playing) return message.channel.send(alreadyPlayingEmbed);
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    message.channel.send(resumedEmbed);
  }

  function loop(message: any, serverQueue:any) {

    const loopEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`🔁 | The loop function is now ${serverQueue.loop ? '**Disabled**' : '**Enabled**'}`)
      .setFooter("Hey Potatis - 2020");
    if (!serverQueue) return message.channel.send(nothingPlayingEmbed);

    serverQueue.loop = !serverQueue.loop
    message.channel.send(loopEmbed);
  }

  async function lyrics(this: any, message: any, serverQueue:any) {

    const fullName = serverQueue.songs[0].title;
    const artist = fullName.slice(0, fullName.indexOf(" -"));
    const title = fullName.slice(fullName.indexOf(" -"), fullName.length);

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
        .setColor("GREEN")
        .setDescription(`\n${lyrics}\n\n**${artist}**`)
        .setFooter("Hey Potatis - 2020");

      message.channel.send(lyricsEmbed);
      })
    } catch (error) {
        console.log(error);
        message.channel.send(errEmbed("ERROR, Please contact @PotatisGrizen#8661"));
        this.client.errHandler(message, error);
      }

  }

  async function remove(this: any, message: any, serverQueue:any) {
  const args = message.content.split(" ");
  if (!serverQueue) return message.channel.send(nothingPlayingEmbed);
  if (!args.length) return message.channel.send(errEmbed("Invalid use of command. Please insert queue number to remove"));
  if (isNaN(args[1])) return message.channel.send(errEmbed("That is no valid amount."));
  if (serverQueue.songs.length == 1) return message.channel.send(errEmbed("There is currently no queue"));
  if (args[0] > serverQueue.songs.length) return message.channel.send(errEmbed(`There is currently only ${serverQueue.songs.length} in the queue.`));
    try {
      const song = serverQueue.songs.splice(args[1] - 1, 1);
      message.channel.send(errEmbed(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`)).catch(console.error);
    } catch (error) {
      console.log(error);
      this.client.errHandler(message, error);
      return message.channel.send(errEmbed("ERROR, Please contact @PotatisGrizen#8661"));
    }
  }

  function shuffle(message: any, serverQueue: any) {
    if (!serverQueue) return message.channels.send(errEmbed("There is no queue.")).catch(console.error);
    try {
      let songs = serverQueue.songs;
      for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
      serverQueue.songs = songs;
      const shuffleEmbed = new MessageEmbed()
          .setTitle("🔀 | I have shuffled the queue.")
          .setColor("GREEN")
          .setFooter("Hey Potatis - 2020");
      message.channel.send(shuffleEmbed);
    } catch (error) {
      serverQueue.voiceChannel.leave();
      serverQueue.connection.dispatcher.end();
      return message.channel.send(errEmbed(`:notes: The player has stopped and the queue has been cleared.: \`${error}\``));
    }
}

export {queue, execute, skip, stop, volume, np, q, pause, resume, loop, lyrics, remove, shuffle}
