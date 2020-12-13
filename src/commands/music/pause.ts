import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {PGClient} from "../../domain/PGClient";
import {pause, queue} from "../../domain/MusicQueue";

class Pause extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "pause",
            description: "Use this to pause the queue",
            usage: ".pause"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return pause(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Pause;
