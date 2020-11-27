require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

const Wumpus = require('./wumpusdb')

client.on('ready', async () => {
  const db = new Wumpus.DB(client)
  console.log(await db.getCollection('781701087073402881'))
})

client.login(process.env.DISCORD_TOKEN)
