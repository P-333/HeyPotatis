import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import {pause, queue, stop} from "../../domain/MusicQueue"

class Stop extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "stop",
            description: "Use this to stop the music queue",
            usage: ".stop",
            aliases: ["leave"]
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return stop(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Stop;
