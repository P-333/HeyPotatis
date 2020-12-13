import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import {queue, np, loop} from "../../domain/MusicQueue";

class Np extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "np",
            description: "Use this to view what is playing",
            usage: ".np",
            aliases: ["nowplaying"]
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return np(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Np;
