import Document from './Document'
import Discord, { Snowflake } from '../helper/discord'

export default class Collection {
  id
  documents
  #client

  /**
   * @param client Discord client
   * @param channel Discord channel linked to the collection
   * @param documents Documents in collection
   */
  constructor (client: Discord, channel: Snowflake, documents: Map<string, Document>) {
    this.#client = client
    this.id = channel
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
      throw new Error('Unable to retrieve document')
    }
  }

  /**
   * Inserts a new document into the collection
   * @param documentID Document ID
   * @param rawData Data in Document body
   */
  async insertDocument (documentID: string, rawData: Object): Promise<Document> {
    if (this.documents.has(documentID)) throw new Error(`Collection already has document with ID "${documentID}"`)

    try {
      const messageContent = [`||DOCUMENT INSERTED AT ${new Date().toISOString()}||`, documentID, '---', JSON.stringify(rawData)]
      const message = await this.#client.createMessage(this.id, messageContent.join('\n'))

      const data = {
        information: rawData,
        message,
        id: documentID
      }

      const document = new Document(this.#client, data)
      this.documents.set(documentID, document)
      return document
    } catch (error) {
      throw new Error(error)
    }
  }
}
