import 'dotenv/config'
import linebot from 'linebot'
import commandArt from './commands/art.js'
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})
bot.on('message', function (event) {
  // console.log(event)
  if (event.message.type === 'sticker') {
    commandArt(event)
  } else {
    event.reply('只支援貼圖喔！')
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
