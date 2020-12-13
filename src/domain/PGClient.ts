import { Client, MessageEmbed } from 'discord.js';
import * as moment from 'moment';
import { load } from './CommandHandler';
import { Command } from './Command';

class PGClient extends Client {

    public commands: Map<string, Command>
    public aliases: Map<string, string>

    constructor(token: any) {

        super();
        super.login(token).then();

        this.aliases = new Map();
        this.commands = this.getCommands();
    }

    public getTime() {
        return moment(Date.now())
            .toString()
            .split(" ")
            .splice(0, 5)
            .join(" ");
    }

    public randomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

    private getCommands(): Map<string, Command> {
        return this.commands = load(this);
    }

    public errHandler(message: any, err: any){
        const errEmbed: MessageEmbed = new MessageEmbed()
            .setTitle("Error")
            .setDescription(`There has been an error:`)
            .setThumbnail('https://kajidata.com/resources/2019/02/error.jpeg')
            .addFields(
                [
                    { name: 'Guild:', value: message.guild.id},
                    { name: 'Channel:', value: message.channel},
                    { name: 'Author:', value: message.author},
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Error:', value: '```prolog\n' + err + '\n```'}
                ]
            )
            .setTimestamp()
            .setColor("RED")
            .setFooter("Hey Potatis - 2020");

        message.client.users.cache.get("196245585945165824").send(errEmbed);
    }

    public getMember(message: any, toFind: String) {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find((member: any )=> {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    }
}

export { PGClient }
