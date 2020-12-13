import { PGClient } from "./domain/PGClient";
import { config } from "dotenv";
import {Message, MessageEmbed} from "discord.js";
import { readFile } from 'fs'

config({ path: "../.env" });

const client: PGClient = new PGClient(process.env.BOT_TOKEN);
const PREFIX = process.env.PREFIX as string;

client.on("ready", async (): Promise<void> => {
    const url: string = await client.generateInvite({
        permissions: ["ADMINISTRATOR"]
    });

    console.log(`\nGuilds     ==      ${client.guilds.cache.size}`);
    console.log(`Users:     ==      ${client.users.cache.size}`);
    console.log(`Commands:  ==      ${client.commands.size}`);
    console.log(`Time:      ==      ${client.getTime()}`);
    console.log(`Invite:    ==      ${url}\n`);


    let statuses: any;

    setInterval(function() {

        readFile('../resources/statuses.json', 'utf8', (err, data) => {

            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                statuses = JSON.parse(data);
            }
        });

        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user?.setPresence({
            status: "online",
            activity: {
                name: status,
                type: "COMPETING",
                url: "https://potatisgrizen.com"
            }
        });
    }, 5000);
});

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
// if(process.env.NODE_ENV === 'development') client.on("debug", (e) => console.info(e));

process.on('uncaughtException', error => console.log(error));
+
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on("voiceStateUpdate", state =>  {
    if (state.serverDeaf) return
    if (state.id == '759787879479115807' && '548231969637662720') {
        return state.setDeaf(true);
    }
})

client.on("message", async (message: Message): Promise<void> => {
    try {
        if(message.author.bot) return;
        if(message.channel.type !== "text") return;

        if(!message.content.startsWith(PREFIX)) return;

        const args: Array<string> = message.content.slice(PREFIX.length).trim().split(/ +/g);
        const cmd: string = args.shift()!.toLowerCase();

        let command: any;

        if (cmd.length === 0) return;

        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd)!)
        } else return;

        if (command) command.run(message, args)

    } catch (err ) {
        const errorEmbed = new MessageEmbed()
            .setTitle("Error")
            .setDescription("I have contacted @PotatisGrizen#8661\nThe problem will be fixed soon." )
            .setColor("RED")
            .setFooter("Hey Potatis - 2020");
        client.errHandler(err, message);
        await message.channel.send(errorEmbed);
    }
});
