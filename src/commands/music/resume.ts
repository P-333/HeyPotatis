import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import {pause, queue, resume} from "../../domain/MusicQueue";

class Resume extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "resume",
            description: "Use this to resume the queue",
            usage: ".resume"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return resume(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Resume;
