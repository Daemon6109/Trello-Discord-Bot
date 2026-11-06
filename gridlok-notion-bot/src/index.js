import 'dotenv/config';
import {Client, GatewayIntentBits, Events} from 'discord.js';
import {handleInteraction} from './bot.js';
const required=['DISCORD_TOKEN','NOTION_TOKEN'];
const missing=required.filter(k=>!process.env[k]);
if (missing.length) { console.error(`Missing configuration: ${missing.join(', ')}`); process.exit(1); }
const client=new Client({intents:[GatewayIntentBits.Guilds]});
const config={token:process.env.NOTION_TOKEN,dataSourceId:process.env.NOTION_DATA_SOURCE_ID || 'c0f83a57-42a2-481c-a43d-88aad6bd734b'};
client.once(Events.ClientReady,()=>console.log('GRIDLOK bot is ready.'));
client.on(Events.InteractionCreate,interaction=>{handleInteraction(interaction,config).catch(()=>console.error('Interaction handling failed.'));});
client.on(Events.Error,()=>console.error('Discord client error.'));
client.login(process.env.DISCORD_TOKEN).catch(()=>{console.error('Discord login failed; check the bot token and connectivity.');process.exitCode=1;});
