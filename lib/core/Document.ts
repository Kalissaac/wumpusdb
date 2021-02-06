// import type Collection from './Collection'
import type { Message as DiscordMessage } from 'discord.js'

interface RawDocumentData {
  information: { [key: string]: any },
  message: DiscordMessage,
  id: string
}

export default class Document {
  id
  collection
  createdAt
  lastEdited
  #data
  #message

  constructor (data: RawDocumentData) {
    this.id = data.id
    this.#message = data.message
    this.collection = this.#message.channel.id
    this.createdAt = this.#message.createdAt
    this.lastEdited = this.#message.editedAt
    this.#data = data.information
  }

  get data () {
    return this.#data
  }

  getField (field: string) {
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
      this.#message.edit(newContent.join('\n'))
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
      this.#message.delete({
        reason: 'Document deleted from DB'
      })
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
