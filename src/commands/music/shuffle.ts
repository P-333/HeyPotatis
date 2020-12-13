import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {PGClient} from "../../domain/PGClient";
import {queue, shuffle} from "../../domain/MusicQueue";

class Shuffle extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "shuffle",
            description: "Shuffle the queue",
            usage: ".loop"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return shuffle(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Shuffle
