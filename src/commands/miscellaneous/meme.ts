// import {Command} from "../../domain/Command";
// import {Message} from "discord.js";
// import {PGClient} from "../../domain/PGClient";
// import {getRandomMeme} from '@blad3mak3r/reddit-memes';


// class Meme extends Command {

//     constructor(client: PGClient) {
//         super(client, {
//             name: "meme",
//             description: "A meme command",
//             usage: ".meme"
//         })
//     }

//     run(message: Message, args: Array<string>) {
//         if (args[0]) {
//             try {
//                 getRandomMeme(args[0]).then(Meme => {
//                     return message.channel.send(Meme.image);
//                 })
//             } catch (err) {
//                 this.client.errHandler(message, err);
//             }
//             return
//         }
//         try {
//             getRandomMeme().then(Meme => {
//                 return message.channel.send(Meme.image);
//             })
//         } catch (err) {
//             this.client.errHandler(message, err);
//         }
//     }

// }

// export = Meme;
