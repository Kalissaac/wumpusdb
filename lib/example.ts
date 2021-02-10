import * as Wumpus from './wumpusdb'

require('dotenv').config()

async function main () {
  if (!process.env.DISCORD_TOKEN) throw new Error('Discord bot token required!')
  try {
    const db = new Wumpus.DB(process.env.DISCORD_TOKEN)
    const collection = await db.getCollection('781701087073402881')
    const doc = await collection.insertDocument(Math.floor(Math.random() * 1000000) + 'n', { hey: 'sup' })
    await doc.update({ john: 'bob' })
    const doc2 = await collection.getDocument(doc.id)
    console.log(doc.data === doc2.data)
    doc.delete()
  } catch (error) {
    console.error(error)
  }
}

main()
