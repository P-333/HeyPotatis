import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { PGClient } from "../../domain/PGClient";

class Invite extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "invite",
            description: "Get the invite url for the bot",
            usage: ".invite"
        })
    }

    async run(message: Message, args: Array<string>) {
        const url: string = await this.client.generateInvite({
            permissions: ["ADMINISTRATOR"]
        });
        const inviteEmbed: MessageEmbed = new MessageEmbed()
            .setTitle("Invite url")
            .setURL(url)
            .setColor("GREEN")
            .setFooter("Hey Potatis - 2020");
        await message.channel.send(inviteEmbed)
    }

}

export = Invite;
