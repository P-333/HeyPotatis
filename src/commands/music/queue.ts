import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {PGClient} from "../../domain/PGClient";
import {q, queue} from "../../domain/MusicQueue";

class Queue extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "queue",
            description: "Use this to view what is playing",
            usage: ".queue",
            aliases: ["q"]
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return q(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Queue;
