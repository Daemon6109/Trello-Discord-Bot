import 'dotenv/config';
import {REST, Routes} from 'discord.js';
import {commands} from './commands.js';
const required=['DISCORD_TOKEN','APPLICATION_ID','GUILD_ID']; const missing=required.filter(k=>!process.env[k]);
if (missing.length) {console.error(`Missing configuration: ${missing.join(', ')}`);process.exit(1);}
try {
 const rest=new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN);
 await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID,process.env.GUILD_ID),{body:commands.map(c=>c.toJSON())});
 console.log('Registered GRIDLOK guild commands.');
} catch {console.error('Command registration failed; check IDs, token, permissions and connectivity.');process.exitCode=1;}
