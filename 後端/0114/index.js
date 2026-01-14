import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import routeProduct from './routes/product.js'

// 資料庫連線
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

// 建立一個express的應用程式
const app = express()
// 讓它去讀傳入的JSON
app.use(express.json())
// express解析請求的JSON時發生錯誤時，使用4個參數，回覆400
app.use((error, req, res, _next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    message: '資料格式錯誤',
  })
})
// 從路徑/product 進來的請求，全度丟給 routeProduct 這個路由去做
app.use('/product', routeProduct)

// 監聽 4000 port 請求
app.listen(4000, () => {
  console.log('伺服器啟動 http://localhost:4000')
})
