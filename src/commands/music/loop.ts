import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import { queue, loop } from "../../domain/MusicQueue";

class Loop extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "loop",
            description: "Toggle the loop function",
            usage: ".loop"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return loop(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Loop
