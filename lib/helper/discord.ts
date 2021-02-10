import fetch from 'node-fetch'
import * as WebSocket from 'ws'

const baseUrl = 'https://discord.com/api/v8'

export type Snowflake = string

export interface Message {
  id: Snowflake,
  channel_id: string,
  guild_id?: string,
  author: any,
  member: any,
  content: string,
  timestamp: number,
  edited_timestamp: number
}

export interface Channel {
  id: Snowflake,
  name: string
}

export default class Discord {
  authToken
  #socket?: WebSocket

  constructor (authToken: string, withWebSocket = true) {
    this.authToken = authToken
    if (withWebSocket) this.#initializeSocket()
  }

  #sendRequest = async (path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: any): Promise<any> => {
    const request = await fetch(baseUrl + path, {
      headers: {
        Authorization: 'Bot ' + this.authToken,
        'Content-Type': typeof body === 'object' ? 'application/json' : ''
      },
      method,
      body: typeof body === 'object' ? JSON.stringify(body) : body
    })

    if (request.ok) {
      return await request.json()
    } else {
      console.error(await request.json())
      return Promise.reject(request.statusText)
    }
  }

  #initializeSocket = async () => {
    const gateway = await this.#sendRequest('/gateway/bot', 'GET')
    this.#socket = new WebSocket(gateway.url + '?v=8&encoding=json')

    let sequenceNumber: number
    this.#socket.once('message', e => {
      const data = JSON.parse(e)
      // Start sending hearbeats
      this.#socket?.send(JSON.stringify({
        op: 1,
        d: null
      }))
      setInterval(() => {
        this.#socket?.send(JSON.stringify({
          op: 1,
          d: sequenceNumber ?? null
        }))
      }, data.d.heartbeat_interval)

      // Identify
      this.#socket?.send(JSON.stringify({
        op: 2,
        d: {
          token: this.authToken,
          properties: {
            '$os': 'linux',
            '$browser': '',
            '$device': ''
          },
          intents: 0
        }
      }))
    })

    this.#socket.on('open', () => {
      console.log('[WebSocket] connection open')
    })
    this.#socket.on('message', e => {
      console.log('[WebSocket] message recieved: ', e.toString())
      const data = JSON.parse(e.toString())
      switch (data.op) {
        case 0:
          sequenceNumber = data.s
          break
        default:
          break
      }
    })
    this.#socket.on('close', opcode => {
      console.log('[WebSocket] connection closed with code ', opcode)
    })

    process.on('exit', () => {
      this.#socket?.close(1000)
    })
  }

  async createChannel (guild: Snowflake, name: string): Promise<Channel> {
    return await this.#sendRequest(`/guilds/${guild}/channels`, 'POST', {
      name
    })
  }

  async getMessages (channel: Snowflake): Promise<Message[]> {
    return await this.#sendRequest(`/channels/${channel}/messages`, 'GET')
  }

  async createMessage (channel: Snowflake, content: string): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages`, 'POST', {
      content
    })
  }

  async editMessage (channel: Snowflake, message: Snowflake, content: string): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages/${message}`, 'PATCH', {
      content
    })
  }

  async deleteMessage (channel: Snowflake, message: Snowflake): Promise<Message> {
    return await this.#sendRequest(`/channels/${channel}/messages/${message}`, 'DELETE')
  }
}
