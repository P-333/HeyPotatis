import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { PGClient } from "../../domain/PGClient";


class Love extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "love",
            description: "Calculates the love affinity you have for another person.",
            usage: ".love"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            // Get a member from mention, id, or username
            let person = this.client.getMember(message, args[0]);

            const love = this.client.randomInt(0, 100);
            const loveIndex = Math.floor(love / 10);
            const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

            const embed = new MessageEmbed()
                .setColor("#ffb6c1")
                .addField(`☁ **${person.displayName}** loves **${message.member?.displayName}** this much:`,
                    `💟 ${Math.floor(love)}%\n\n${loveLevel}`);

            return message.channel.send(embed);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Love;
