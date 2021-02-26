import { PGClient } from './PGClient';
import { Command } from './Command';
import { readdirSync } from 'fs';


const load = (client: PGClient): Map<string, Command> => {
  const cmds: Map<string, Command> = new Map();
    
  const commandFolders: Array<string> = readdirSync('./commands/');

  commandFolders.forEach((folder: string) => {

    const commandFiles: Array<string> = readdirSync(`./commands/${folder}/`).filter((c: string) => c.endsWith('.js'));
    
    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pull = require(`../commands/${folder}/${file}`);
      const cmd: Command = new pull(client);

      cmds.set(cmd.name, cmd);

      if (cmd.aliases) {
        cmd.aliases.forEach((alias: string) => {
          client.aliases.set(alias, cmd.name);
        });
      }
    }
  });

  return cmds;
};

export { load };