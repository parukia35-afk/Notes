import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

// 新增商品的controllers
export const create = async (req, res) => {
  try {
    const result = await new Product(req.body)
    await result.save()
    res.status(StatusCodes.CREATED).json({
      result,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
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
}

// 搜尋商品
export const get = async (req, res) => {
  try {
    /* Product.find({條件},欲顯示欄位) 查詢語法:
    "欲顯示欄位":回傳的資料只會顯示指定要或不要欄位
    例:'name price'--->欄位只會顯示 name和 price
    '-price'--->欄位不要顯示 price
    
    "條件":大括號裡放條件。玩法很多，可指定某欄位的值應大於小於等於甚麼或
    例:{category:'遊戲'}--->只回傳category欄位的值為'遊戲'的資料
    {category:{$in:['手機','遊戲']}}--->回傳category為'手機'或'遊戲'的資料
    {price:{$gte:30000,}}--->搜尋price的值大於等於 30000
    {$text:{$search:'google'},}--->搜尋文字(空文字會找不到內容)，文字需完整包含google，只搜goo會搜不到。必須建立文字索引才能用。見models/product.js 第32行
    */
    const result = await Product.find().sort({ price: -1 })
    /* find()完後可以做排序.sort()
    大括號內放排序方式 {欄位:方向}
    {price:1}-->依價格升冪排序
    {price:-1}-->依價格降冪排序
    */
    /* sort()完還可以做限制.limit()和跳過.skip()，結合此兩種功能可做到搜尋結果每頁應呈現幾筆的跳頁功能。
    limit(2)--->只回傳2筆
    skip(2)--->跳過前兩筆
    */
    /* 結合上次教的網址帶參數的搜尋
    網址打 http://localhost:4000/product/?name=switch

    const result = await Product.find({
      $text: {
        $search: req.query.name,
      },
    })
    相當於搜尋文字為switch的資料
    */
    res.status(StatusCodes.OK).json({
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}
