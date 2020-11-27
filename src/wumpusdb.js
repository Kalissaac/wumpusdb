const Discord = require('discord.js')

class DB {
  client

  /**
   *
   * @param {Discord.Client} client
   */
  constructor (client) { // eslint-disable-line
    this.client = client
  }

  /**
   * Retrieves a collection in the database
   * @param {Discord.Snowflake} collection
   */
  async getCollection (collection) {
    /**
     * @type {Discord.TextChannel}
     */
    const channel = await this.client.channels.fetch(collection)
    channel.send('||DOCUMENT INSERTED AT ' + new Date().toISOString() + '||\n' + Math.floor(Math.random() * Math.floor(10000000)) + '\n---\n' + JSON.stringify({ hi: 'jo', sup: 'bobby' }))
    const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => m.author.id === this.client.user.id)
    const data = new Map()
    messages.each((message) => {
      const document = parseMessage(message)
      if (!document) return
      data.set(document.id, document.information)
    })
    return new Collection(collection, data)
  }
}

function parseMessage (message) {
  const data = {
    information: {
      _meta: {
        locator: message.id,
        raw: message.content
      }
    }
  }
  const tokens = message.content.split('\n')
  if (tokens.length === 1) return
  data.id = tokens[1]
  data.information = {
    ...data.information,
    ...JSON.parse(tokens[3])
  }
  return data
}

class Collection {
  id
  documents

  constructor (id, documents) {
    this.id = id
    this.documents = documents
  }
}

class Document {

}

module.exports = exports = {
  DB
}