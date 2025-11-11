import axios from 'axios'
import template from '../templates/food.json' with { type: 'json' }
import { distance } from '../utils/distance.js'
// import fs from 'node.js'

export default async (event) => {
  try {
    const { data } = await axios(
      'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193',
    )
    const bubbles = data
      .map((value) => {
        value.distance = distance(
          event.message.latitude,
          event.message.longitude,
          value.Latitude,
          value.Longitude,
          'K',
        )
        return value
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((value) => {
        const address = value.City + value.Town + value.Address
        const googleMapUrl = `https://www.google.com/maps/@${value.Latitude},${value.Longitude},18.5z`
        const url = value.url || googleMapUrl
        const picUrl = value.PicUrl || 'https://placehold.co/600x400?text=No+Image'
        const tel = value.Tel || '無提供電話'

        // 將資料帶入fliex 卡片模板
        const bubble = JSON.parse(JSON.stringify(template))
        bubble.hero.url = picUrl
        bubble.body.contents[0].text = value.Name
        bubble.body.contents[1].contents[0].contents[1].text = address
        bubble.body.contents[1].contents[1].contents[1].text = tel
        bubble.footer.contents[0].action.uri = url
        bubble.footer.contents[1].action.uri = googleMapUrl

        return bubble
      })

    const result = await event.reply({
      type: 'flex',
      altText: '農村美食',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    })
    if (result.message) {
      await event.reply('發生錯誤')
      console.log(result)
      // fs.writeFileSync('./dump.json', JSON.stringify(bubbles, null, 2))
    }
  } catch (err) {
    console.error(err)
    event.reply('取得餐廳資訊失敗，請稍後再試')
  }
}
