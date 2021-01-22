import Collection from '@core/Collection'
import Document from '@core/Document'
import type Discord from 'discord.js'

export default class DB {
  client

  /**
   * Initializes a DB instance
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
  async getCollection (collection: Discord.Snowflake): Promise<Collection> {
    try {
      const channel = await this.client.channels.fetch(collection) as Discord.TextChannel
      const messages = (await channel.messages.fetch({ limit: 100 }))
        .filter((m: Discord.Message) => m.author.id === this.client.user?.id)

      const data: Map<Discord.Snowflake, Document> = new Map()
      messages.each((message: Discord.Message) => {
        const document = parseMessage(message, collection)
        if (!document) return
        data.set(document.id, document)
      })

      return new Collection(channel, data)
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
function parseMessage (message: Discord.Message, collection: Discord.Snowflake): Document {
  const data = {
    meta: {
      collection: collection,
      locator: message.id,
      message: message
    },
    information: {},
    id: ''
  }
  const tokens = message.content.split('\n')
  data.id = tokens[1]
  data.information = JSON.parse(tokens[3])
  return new Document(data)
}

/**
 * Discord message schema:
 * L  CONTENT
 * ----------
 * 1  Separator containing document insertion time
 * 2  Document ID
 * 3  Separator
 * 4  Document Data
 */
