import 'dotenv/config'
import linebot from 'linebot'
import commandUSD from './command/usd.js'
import commandFood from './command/food.js'
import commandQuick from './command/quick.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

bot.on('message', (event) => {
  if (event.message.type === 'text') {
    if (event.message.text === 'usd') {
      commandUSD(event)
    } else if (event.message.text === 'quick') {
      commandQuick(event)
    }
  } else if (event.message.type === 'location') {
    commandFood(event)
  }
})

bot.on('postback', (event) => {
  console.log(event)
  event.reply(event.postback.data)
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
