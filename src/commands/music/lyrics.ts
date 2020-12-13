import { Command } from "../../domain/Command";
import { Message } from "discord.js";
import { PGClient } from "../../domain/PGClient";
import { queue, lyrics } from "../../domain/MusicQueue";

class Lyrics extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "lyrics",
            description: "Get the lyrics of the song",
            usage: ".lyrics"
        })
    }

    run(message: Message, args: Array<string>) {
        try {
            const serverQueue = queue.get(message.guild!.id);
            return lyrics(message, serverQueue);
        } catch (err) {
            this.client.errHandler(message, err);
        }
    }

}

export = Lyrics;