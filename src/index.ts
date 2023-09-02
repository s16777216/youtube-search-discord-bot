import { Client, GatewayIntentBits, Events } from "discord.js";
import EventHandler from './event/index'

const client = new Client({ intents: [GatewayIntentBits.Guilds]})

client.once(Events.ClientReady, EventHandler.clientReady)
client.on(Events.InteractionCreate, ()=>{})

import { token } from '../config.json'
client.login(token)