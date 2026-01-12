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
/* -----------------express 的順序不能亂，怎麼寫的就照甚麼執行----------------- */
// 建立網頁伺服器
const app = express()
// 設定 express 解析JSON的請求 body (express預設不會解析body，以前甚至還要再裝body-parser套件，現已整合)
app.use(express.json())

/*
// middleware 參數數量
// 2 = res, res = 最後處理
// 3 = req, res, next = 中間的middleware
// 4 = error, req, res, next = 前一個middleware的錯誤處理
*/

// express解析請求的JSON時發生錯誤，使用4個參數，回覆400
app.use((error, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    message: '資料格式錯誤',
  })
})
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
    else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        // 409 : 請求與目標資源的當前狀態存在衝突
        message: '帳號或信箱重複',
      })
    }
    // 3. 預期外的錯誤(我也不知道是甚麼的錯誤，像是打錯字?)
    else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
})

// 查詢
app.get('/', async (req, res) => {
  try {
    const users = await User.find() // find({})可放大括號內放搜尋的條件
    res.status(StatusCodes.OK).json({
      result: users,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
})

// 查詢單個資料，透過指定id
// 因為 get 的請求沒有body，所以要查id的話要把id放網址上
app.get('/:id', async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID') // 檢查ID是不是有效的 mongoDB ID
    /* find回傳符合的結果會是陣列(儘管結果只有一筆)，可以用[0]指定第一筆
       const user = await User.find({ _id: req.params.id })[0] */

    /* 或使用findOne 回傳符合的第一筆資料
       const user = await User.findOne({_idLreq.params.id}) */

    /* 或直接用findByID查 */
    // .orFail() 用來處理找不到的情況(比如輸入的id在資料庫根本沒有，這時的 user變數會等於null)，這是mongoDB提供的一種更好寫法(可少寫一個if)。不寫orFail，改寫if (user === null) throw new Error('NOTFOUND) 也可以。
    const user = await User.findById(req.params.id).orFail(new Error('NOTFOUND'))
    res.status(StatusCodes.OK).json({
      result: user,
    })
  } catch (error) {
    if (error.message === 'ID' || error.name === 'CastError') {
      // CastError 是當搜尋的id不符合mongoDB的格式時，出現的錯誤名稱。不過前面我們有用 validator套件驗證擋掉這個可能了，理應不可能發生。
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '無效的ID',
      })
    } else if (error === 'NOTFOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '找不到',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
})

// 改資料
app.patch('/:id', async (req, res) => {
  // 檢查欲修改的資料的id是不是有效的 mongoDB ID
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID') // 檢查欲修改資料的id是不是有效的 mongoDB ID

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      // findByIdAndUpdate(要找的id,欲更新的內容,mongoose對於更新資料的設定) // mongoose的更新設定有些很奇怪，像new預設是false，會回傳更新前的資料。
      new: true, // 回傳更新後的資料
      runValidators: true, // 執行驗證
    }).orFail(new Error('NOTFOUND'))

    res.status(StatusCodes.OK).json({
      result: user,
    })
    // 以下這些錯誤是從新增和查詢的code抄來的，改資料所遇到的錯誤基本上都相同
  } catch (error) {
    if (error.message === 'ID' || error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '無效的ID',
      })
    } else if (error === 'NOTFOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '找不到',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        message,
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        message: '帳號或信箱重複',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
})

// 刪資料
app.delete('/:id', async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID') // 檢查欲修改資料的id是不是有效的 mongoDB ID

    await User.findByIdAndDelete(req.params.id).orFail(new Error('NOTFOUND'))
    res.status(StatusCodes.OK).json({
      message: '刪除成功',
    })
    // 以下這些錯誤是從新增和查詢的code抄來的，改資料所遇到的錯誤基本上都相
  } catch (error) {
    if (error.message === 'ID' || error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '無效的ID',
      })
    } else if (error === 'NOTFOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '找不到',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
})
// 監聽 4000 port 請求
app.listen(4000, () => {
  console.log('伺服器啟動 http://localhost:4000')
})
