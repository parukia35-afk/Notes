import axios from 'axios'
import template from '../templates/event.json' with { type: 'json' }

export default async function (event) {
  try {
    const { data } = await axios.get(
      'https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=all',
    )
    const now = new Date().getTime()
    const validShows = data
      .filter((show) => show.startDate)
      .sort((a, b) => {
        const diffA = Math.abs(new Date(a.startDate).getTime() - now)
        const diffB = Math.abs(new Date(b.startDate).getTime() - now)
        return diffA - diffB
      })
      .slice(0, 6)
      .map((value) => {
        const newTemplate = JSON.parse(JSON.stringify(template))
        const title = value.title
        const location = value.showUnit || '地點未提供'
        const time = `${value.startDate}~${value.endDate}`
        const pic =
          value.imgUrl ||
          'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
        const uri =
          value.webSales ||
          'https://www.marketersgo.com/wp-content/uploads/2020/04/Error_404__Not_Found___1.png'
        const lat = value.showInfo?.[0]?.latitude
        const lon = value.showInfo?.[0]?.longitude
        const maplink =
          lat && lon
            ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
            : `https://www.google.com/maps`

        newTemplate.body.contents[0].text = title
        newTemplate.body.contents[1].contents[0].contents[1].text = location
        newTemplate.body.contents[1].contents[1].contents[1].text = time
        newTemplate.hero.url = pic
        newTemplate.hero.action.uri = uri
        newTemplate.footer.contents[0].action.uri = maplink
        return newTemplate
      })

    const result = await event.reply({
      type: 'flex',
      altText: '近期展覽活動',
      contents: {
        type: 'carousel',
        contents: validShows,
      },
    })
    if (result.message) {
      await event.reply('展覽活動資訊取得失敗，請稍後再試。')
      console.log(result)
    }
  } catch (err) {
    console.error(err)
  }
}
