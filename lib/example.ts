import Discord from 'discord.js'
import * as Wumpus from './wumpusdb'

require('dotenv').config()

const client = new Discord.Client()

let db: Wumpus.DB

client.on('ready', async () => {
  db = new Wumpus.DB(client)
  console.log(await db.getCollection('781701087073402881'))
})

client.on('message', async (message: Discord.Message) => {

})

client.login(process.env.DISCORD_TOKEN)
