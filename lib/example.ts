import * as Discord from 'discord.js'
import * as Wumpus from './wumpusdb'

require('dotenv').config()

const client = new Discord.Client()

let db: Wumpus.DB

client.on('ready', async () => {
  db = new Wumpus.DB(client)
  const collection = await db.getCollection('781701087073402881')
  const doc = await collection.insertDocument(Math.floor(Math.random() * 1000000) + 'n', { hey: 'sup' })
  doc.update({ john: 'bob' })
  const doc2 = await collection.getDocument(doc.id)
  console.log(doc.data === doc2.data)
  doc.delete()
})

client.on('message', async (message: Discord.Message) => {

})

client.login(process.env.DISCORD_TOKEN)
