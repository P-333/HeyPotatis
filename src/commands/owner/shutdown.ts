import { Command } from "../../domain/Command";
import { Message, MessageEmbed } from "discord.js";
import { PGClient } from "../../domain/PGClient";

class Restart extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "restart",
            description: "A restart command for the bot. Owner only",
            usage: ".restart"
        })
    }

    run(message: Message, args: Array<string>) {
        if(!message.author.id === "")
    }

}

export = Restart;
