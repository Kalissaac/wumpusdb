import Collection from './Collection'
import Document from './Document'
import Discord, { Snowflake, Message } from '../helper/discord'

export default class DB {
  client: Discord

  /**
   * Discord bot access token
   * @param accessToken
   */
  constructor (accessToken: string) {
    this.client = new Discord(accessToken, false)
  }

  /**
   * Creates a collection in the database
   * @returns Created collection
   */
  async createCollection (database: Snowflake, referenceName: string): Promise<Collection> {
    try {
      const channel = await this.client.createChannel(database, referenceName)
      return await this.getCollection(channel.id)
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Retrieves a collection in the database
   * @param collection
   * @returns Requested collection
   */
  async getCollection (collection: Snowflake): Promise<Collection> {
    try {
      const messages = await this.client.getMessages(collection)

      const data = new Map<Snowflake, Document>()
      messages.forEach((message: Message) => {
        const document = parseMessage(this.client, message)
        if (!document) return
        data.set(document.id, document)
      })

      return new Collection(this.client, collection, data)
    } catch (error) {
      throw new Error(error)
    }
  }
}

/**
 * Parse a Discord message into a document
 * @param message
 * @returns A document
 */
function parseMessage (client: Discord, message: Message): Document {
  const tokens = message.content.split('\n')
  return new Document(client, {
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
