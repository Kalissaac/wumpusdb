import Document from './Document'
import type { TextChannel as DiscordTextChannel } from 'discord.js'

export default class Collection {
  id
  documents
  #channel

  /**
   * @param channel Discord channel linked to the collection
   * @param documents Documents in collection
   */
  constructor (channel: DiscordTextChannel, documents: Map<string, Document>) {
    this.#channel = channel
    this.id = this.#channel.id
    this.documents = documents
  }

  /**
   * Retrieves a document from the collection
   * @param document Document ID
   * @returns Requested document
   */
  async getDocument (document: string): Promise<Document> {
    const requestedDocument = this.documents.get(document)
    if (requestedDocument) {
      return requestedDocument
    } else {
      return Promise.reject(new Error('Unable to retrieve document'))
    }
  }

  /**
   * Inserts a new document into the collection
   * @param id Document ID
   * @param rawData Data in Document body
   */
  async insertDocument (id: string, rawData: Object) {
    if (this.documents.has(id)) return Promise.reject(new Error(`Collection already has document with ID "${id}"`))

    try {
      const messageContent = [`||DOCUMENT INSERTED AT ${new Date().toISOString()}||`, id, '---', JSON.stringify(rawData)]
      const message = await this.#channel.send(messageContent.join('\n'))

      const data = {
        information: rawData,
        message,
        id
      }

      const document = new Document(data)
      this.documents.set(id, document)
      return document
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
