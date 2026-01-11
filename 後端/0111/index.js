import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import User from './user.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 資料庫連線，connect的語法是promise
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

// 建立網頁伺服器
const app = express()
// 設定 express 解析JSON的請求 body (express預設不會解析body，以前甚至還要再裝body-parser套件，現已整合)
app.use(express.json())
// app.請求方式(路徑，處理function)
// req = 進來的請求  /  res = 出去的回應

// 監聽根目錄進來的post的請求，然後執行以下function
app.post('/', async (req, res) => {
  try {
    // 有兩種寫法，第一種寫法:
    // 類似物件導向，new 一個東西後，將它保存就可以做到新增資料
    const user = new User({
      account: req.body.account,
      email: req.body.email,
    })
    await user.save()

    // 第二種寫法:
    // 用 model 的語法 .create()去新增資料
    // const user = await User.create({
    //   account: req.body.account,
    //   email: req.body.email,
    // })

    // 新增成功則回應狀態碼201代表新增成功，再用JSON回應新增的結果result
    res.status(StatusCodes.CREATED).json({
      result: user,
    })
    // 新增東西有可能會發生錯誤:就是user.js寫的驗證如:帳號要4個字以上
  } catch (error) {
    console.error(error)
    // 根據每一種發生的錯誤回傳res
    // 1. 驗證的錯誤
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        message,
      })
    }
    // 2. 重複的錯誤
  }
})
// 監聽 4000 port 請求
app.listen(4000, () => {
  console.log('伺服器啟動 http://localhost:4000')
})
