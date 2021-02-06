import Collection from './Collection'
import Document from './Document'
import * as Discord from 'discord.js'

export default class DB {
  client

  /**
   * Initializes a DB instance
   * @param client
   */
  constructor (client: Discord.Client) {
    this.client = client
  }

  /**
   * Retrieves a collection in the database
   * @param collection
   * @returns Requested collection
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
 * @param message
 * @returns A document
 */
function parseMessage (message: Discord.Message, collection: Discord.Snowflake): Document {
  const tokens = message.content.split('\n')
  return new Document({
    information: JSON.parse(tokens[3]),
    message,
    id: tokens[1]
  })
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
