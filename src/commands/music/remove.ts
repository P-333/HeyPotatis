import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import {pause, queue, remove} from "../../domain/MusicQueue";

class Remove extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "remove",
            description: "Remove a song from the queue",
            usage: ".remove [number]"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return remove(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Remove;
