require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', async () => {
  console.log('I am ready!')
  console.log(await getDBData('781701087073402881'))
})

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong')
  }
})

async function getDBData (collection) {
  /**
   * @type {Discord.TextChannel}
   */
  const channel = await client.channels.fetch(collection)
  channel.send('||DOCUMENT INSERTED AT ' + new Date().toISOString() + '||\n' + Math.floor(Math.random() * Math.floor(10000000)) + '\n---\nhai: sup\nja: yea')
  const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => m.author.id === client.user.id)
  const data = new Map()
  messages.each((message) => {
    const document = parseMessage(message)
    if (!document) return
    data.set(document.id, document.information)
  })
  return data
}

function parseMessage (message) {
  const data = {
    information: {
      _meta: {
        locator: message.id,
        raw: message.content
      }
    }
  }
  const tokens = message.content.split('\n')
  if (tokens.length === 1) return
  data.id = tokens[1]
  tokens.splice(3).forEach(token => {
    const field = token.split(': ')
    if (field === '_meta') return
    data.information[field.shift()] = field.join(': ')
  })
  return data
}

client.login(process.env.DISCORD_TOKEN)
