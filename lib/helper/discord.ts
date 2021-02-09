import fetch from 'node-fetch'
import * as WebSocket from 'ws'

const baseUrl = 'https://discord.com/api/v8'

interface Message {
  id: string,
  channel_id: string,
  guild_id?: string,
  author: any,
  member: any,
  content: string,
  timestamp: number,
  edited_timestamp: number
}

export default class Discord {
  authToken
  #socket: WebSocket

  constructor (authToken: string) {
    this.authToken = authToken
    this.#socket = new WebSocket('wss://gateway.discord.gg/?v=8&encoding=json')
  }

  #sendRequest = async (path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: any): Promise<any> => {
    const request = await fetch(baseUrl + path, {
      headers: {
        Authorization: 'Bot ' + this.authToken
      },
      method,
      body
    })

    if (request.ok) {
      return await request.json()
    } else {
      return Promise.reject(request.statusText)
    }
  }

  async getMessages (channel: string): Promise<Message[]> {
    return await this.#sendRequest(`/channels/${channel}/messages`, 'GET')
  }

  async createMessage (channel: string): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages`, 'POST')
  }

  async editMessage (channel: string, message: string): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages/${message}`, 'PATCH')
  }

  async deleteMessage (channel: string, message: string): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages/${message}`, 'DELETE')
  }
}
