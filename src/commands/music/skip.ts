import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import {pause, queue, skip} from "../../domain/MusicQueue"

class Skip extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "skip",
            description: "Use this skip a song in the music queue",
            usage: ".skip",
            aliases: ["s"]
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return skip(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Skip;
