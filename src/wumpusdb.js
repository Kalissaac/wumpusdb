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
   * @returns {Promise<Collection>} Requested collection
   */
  async getCollection (collection) {
    try {
      /**
       * @type {Discord.TextChannel}
       */
      const channel = await this.client.channels.fetch(collection)
      // channel.send('||DOCUMENT INSERTED AT ' + new Date().toISOString() + '||\n' + Math.floor(Math.random() * Math.floor(10000000)) + '\n---\n' + JSON.stringify({ hi: 'jo', sup: 'bobby' }))
      const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => m.author.id === this.client.user.id)
      const data = new Map()
      messages.each((message) => {
        const document = parseMessage(message)
        if (!document) return
        data.set(document.id, document)
      })
      return new Collection(collection, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

/**
 * Parse a Discord message into a document
 * @param {Discord.Message} message
 * @returns {Document}
 */
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
  return new Document(data)
}

class Collection {
  id
  documents

  /**
   * @param {Discord.Snowflake} id
   * @param {Map<string, Document>} documents
   */
  constructor (id, documents) {
    this.id = id
    this.documents = documents
  }

  /**
   * Retrieves a document from the collection
   * @param {string} document
   * @returns {Document}
   */
  getDocument (document) {
    return this.documents[document]
  }

  /**
   * Saves any changes made to the collection in the database
   * @param {number} retry How many times to retry saving if it fails
   * @returns {Promise<boolean>} Whether the save was successful
   */
  async save (retry) {
    return true
  }
}

class Document {
  id
  data

  constructor (data) {
    this.id = data.id
    this.data = data.information
  }

  getField (field) {
    return this.data[field]
  }
}

module.exports = exports = {
  DB
}