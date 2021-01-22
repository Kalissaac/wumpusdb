// import type Collection from '@core/Collection'
import type Discord from 'discord.js'

interface RawDocumentData {
  meta: {
    collection: Discord.Snowflake,
    locator: Discord.Snowflake,
    message: Discord.Message
  },
  information: { [key: string]: any },
  id: string
}

export default class Document {
  id
  collection
  #data
  #meta
  #message

  constructor (data: RawDocumentData) {
    this.id = data.id
    this.#meta = data.meta
    this.#message = this.#meta.message
    this.collection = this.#meta.collection
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
