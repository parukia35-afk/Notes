import axios from 'axios'

export default async (event) => {
  console.log('usd command triggered')
  try {
    const { data } = await axios.get('https://tw.rter.info/capi.php') //取得匯率
    const result = await event.reply(data.USDTWD.Exrate.toString()) //回覆
    /* 回覆成功
    {
    sentMessages: []
    }
    回覆失敗
    {
    message: ''
    }
    */
    if (result.message) {
      await event.reply('發生錯誤')
      console.log(result)
    }
  } catch (err) {
    console.error(err)
    event.reply('取得美元匯率失敗，請稍後再試')
  }
}
