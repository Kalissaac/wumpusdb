import Document from '../core/Document'
import * as Discord from 'discord.js'

export default class Collection {
  id
  documents
  #channel

  /**
   * @param {Discord.TextChannel} channel
   * @param {Map<string, Document>} documents
   */
  constructor (channel: Discord.TextChannel, documents: Map<string, Document>) {
    this.#channel = channel
    this.id = this.#channel.id
    this.documents = documents
  }

  /**
   * Retrieves a document from the collection
   * @param {string} document
   * @returns {Document}
   */
  async getDocument (document: string): Promise<Document> {
    const requestedDocument = this.documents.get(document)
    if (requestedDocument) {
      return requestedDocument
    } else {
      return Promise.reject(new Error('Unable to retrieve document'))
    }
  }

  async insertDocument (id: string, data: Object) {
    // channel.send('||DOCUMENT INSERTED AT ' + new Date().toISOString() + '||\n' + Math.floor(Math.random() * Math.floor(10000000)) + '\n---\n' + JSON.stringify({ hi: 'jo', sup: 'bobby' }))
  }
}
