import 'dotenv/config'
import linebot from 'linebot'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

bot.on('message', (event) => {
  if (event.message.type === 'text') {
    event.reply(event.message.text)
  } else {
    event.reply('只接受文字')
  }
})

bot.listen('/', 3000, () => {
  console.log('機器人啟動')
})
