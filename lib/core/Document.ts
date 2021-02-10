// import type Collection from './Collection'
import Discord, { Message as DiscordMessage } from '../helper/discord'

interface RawDocumentData {
  information: { [key: string]: any }
  message: DiscordMessage
  id: string
}

export default class Document {
  id
  collection
  createdAt
  lastEdited
  #data
  #message
  #client

  /**
   * @param client Discord client
   * @param data Raw data of the document
   */
  constructor (client: Discord, data: RawDocumentData) {
    this.#client = client
    this.id = data.id
    this.#message = data.message
    this.collection = this.#message.channel_id
    this.createdAt = this.#message.timestamp
    this.lastEdited = this.#message.edited_timestamp
    this.#data = data.information
  }

  get data (): any {
    return this.#data
  }

  getField (field: string): any {
    return this.#data[field]
  }

  /**
   * Saves changes made to the document in the database
   * @param data The data to save (this will replace all data in a document)
   * @returns Whether the update was successful
   */
  async update (data: { [key: string]: any }): Promise<boolean> {
    try {
      const newContent = this.#message.content.split('\n')
      newContent.pop()
      newContent.push(JSON.stringify(data))
      await this.#client.editMessage(this.collection, this.#message.id, newContent.join('\n'))
      this.#data = data
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Deletes the document from the collection
   * @returns Whether the deletion was successful
   */
  async delete (): Promise<boolean> {
    try {
      await this.#client.deleteMessage(this.collection, this.#message.id)
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
