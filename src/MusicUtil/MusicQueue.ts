import {MessageEmbed} from 'discord.js';

const queue = new Map();

const noVoiceEmbed = new MessageEmbed()
  .setColor('RED')
  .setTitle('🚫 | You are currently not in a voice channel. Please join one before the use of music commands.')
  .setFooter('Hey Potatis - 2020');

const noPermissionEmbed = new MessageEmbed()
  .setColor('RED')
  .setTitle('🚫 | I need the permission to join and speak in your voice channel!')
  .setFooter('Hey Potatis - 2020');

const nothingPlayingEmbed = new MessageEmbed()
  .setColor('YELLOW')
  .setTitle('There is no music playing right now')
  .setFooter('Hey Potatis - 2020');

const errEmbed = (msg: string) => {
  if (msg) {
    return new MessageEmbed()
        .setTitle(msg)
        .setColor('RED')
        .setFooter('Hey Potatis - 2020');
  }
};

export { queue, noPermissionEmbed, noVoiceEmbed, nothingPlayingEmbed, errEmbed};