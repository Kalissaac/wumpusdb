import type Discord from 'discord.js'

class DB {
  client

  /**
   *
   * @param {Discord.Client} client
   */
  constructor (client: Discord.Client) {
    this.client = client
  }

  /**
   * Retrieves a collection in the database
   * @param {Discord.Snowflake} collection
   * @returns {Promise<Collection>} Requested collection
   */
  async getCollection (collection: Discord.Snowflake) {
    try {
      /**
       * @type {Discord.TextChannel}
       */
      const channel = await this.client.channels.fetch(collection)
      // channel.send('||DOCUMENT INSERTED AT ' + new Date().toISOString() + '||\n' + Math.floor(Math.random() * Math.floor(10000000)) + '\n---\n' + JSON.stringify({ hi: 'jo', sup: 'bobby' }))
      const messages = (await channel.messages.fetch({ limit: 100 })).filter((m: Discord.Message) => m.author.id === this.client.user.id)
      const data = new Map()
      messages.each((message: Discord.Message) => {
        const document = parseMessage(message, collection)
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
 *
 * @returns {Document}
 */
function parseMessage (message: Discord.Message, collection) {
  const data = {
    information: {
      _meta: {
        collection: collection.id,
        locator: message.id,
        raw: message.content,
        message: message
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
  return new Document(data, collection)
}

class Collection {
  id
  documents

  /**
   * @param {Discord.Snowflake} id
   * @param {Map<string, Document>} documents
   */
  constructor (id: Discord.Snowflake, documents) {
    this.id = id
    this.documents = documents
  }

  /**
   * Retrieves a document from the collection
   * @param {string} document
   * @returns {Document}
   */
  getDocument (document: string) {
    return this.documents[document]
  }
}

class Document {
  id
  collection
  #data
  #message

  constructor (data, collection) {
    this.id = data.id
    this.collection = collection
    this.#data = data.information
    this.#message = this.#data._meta.message
  }

  get data () {
    return this.#data
  }

  getField (field) {
    return this.#data[field]
  }

  /**
   * Saves changes made to the document in the database
   * @param {Object} data The data to save
   * @param {number} retry How many times to retry saving if it fails
   * @returns {Promise<boolean>} Whether the save was successful
   */
  async update (data, retry) {
    return true
  }

  /**
   * Deletes the document from the collection
   * @param {number} retry How many times to retry saving if it fails
   * @returns {Promise<boolean>} Whether the save was successful
   */
  async delete (retry) {
    return this.#data._meta.message.delete()
  }
}

export {
  DB
}
