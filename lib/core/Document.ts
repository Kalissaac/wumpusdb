// import type Collection from '@core/Collection'
import * as Discord from 'discord.js'

interface RawDocumentData {
  information: { [key: string]: any },
  message: Discord.Message,
  id: string
}

export default class Document {
  id
  collection
  #data
  #message

  constructor (data: RawDocumentData) {
    this.id = data.id
    this.#message = data.message
    this.collection = this.#message.channel.id
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
   * @param {{ [key: string]: any }} data The data to save (this will replace all data in a document)
   * @returns {Promise<boolean>} Whether the update was successful
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
   * @returns {Promise<boolean>} Whether the deletion was successful
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
