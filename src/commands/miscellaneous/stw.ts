import {Command} from "../../domain/Command";
import {Message, MessageEmbed} from "discord.js";
import {PGClient} from "../../domain/PGClient";

class Stw extends Command {

    constructor(client: PGClient) {
        super(client, {
            name: "stw",
            description: "",
            usage: "",
            aliases: []
        })
    }

    async run(message: Message, args: Array<string>) {

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel")

        const embed: MessageEmbed = new MessageEmbed()
            .setTitle("Spin the Wheel")
            .setColor("GREEN")
            .setDescription("React with the reaction below to spin the wheel")
            .setFooter("Hey Potatis - 2020");

        const main = await message.channel.send(embed)

        try {
            await main.react("🔄");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction: any) =>
            ["🔄"].includes(reaction.emoji.name);
        const collector = main.createReactionCollector(filter, { time: 6000000 });

        collector.on("collect", async (reaction: any) => {
            try {
                let newRandom: any;
                let oldRandom: any;
                if (reaction.emoji.name === "🔄") {
                    oldRandom = newRandom;
                    newRandom = voiceChannel.members.random();
                    if(newRandom == oldRandom) newRandom = voiceChannel.members.random();
                    const randomEmbed: MessageEmbed = new MessageEmbed()
                        .setTitle("Spin the Wheel")
                        .setColor("GREEN")
                        .setDescription(`React with the reaction below to spin the wheel\n\n**Your random user are:** ${newRandom} `)
                        .setFooter("Hey Potatis - 2020")
                    main.edit(randomEmbed);
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });
    }

}

export = Stw;


