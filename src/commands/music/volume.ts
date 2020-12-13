import {Command} from "../../domain/Command";
import {Message} from "discord.js";
import {PGClient} from "../../domain/PGClient";
import {queue, volume} from "../../domain/MusicQueue";

class Volume extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "volume",
            description: "Use this to change the volume",
            usage: ".volume",
            aliases: ["v"]
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return volume(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Volume;
