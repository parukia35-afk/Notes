import { StatusCodes } from 'http-status-codes'
import validator from 'validator'
import User from '../models/user.js'
import Product from '../models/product.js'

// 創建新使用者
export const create = async (req, res) => {
  try {
    const result = new User(req.body)
    await result.save()
    res.status(StatusCodes.OK).json({
      result,
    })
  } catch (error) {
    // 1. 驗證錯誤
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
}
// 使用者將商品加入購物車
export const cart = async (req, res) => {
  try {
    // 驗證網址路徑的使用者ID格式
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('USER ID')
    }
    // 驗證要放入購物車的商品ID格式
    if (!validator.isMongoId(req.body.product)) {
      throw new Error('PRODUCT ID')
    }
    // 檢查商品是否存在
    await Product.findById(req.body.product).orFail(new Error('PRODUCT NOT FOUND'))
    // 取出使用者資料
    const user = await User.findById(req.params.id).orFail(new Error('USER NOT FOUND'))
    // 檢查購物車內是否已經有欲新增的商品
    const i = user.cart.findIndex((item) => item.product.toString() === req.body.product) // 購物車內的product的資料型態是ObjectId，用toString()轉成一般文字才能跟資料型態是字串的req.body.producct比較。
    // 如果購物車已有這個商品，findIndex()傳回的會是其索引
    if (i > -1) {
      user.cart[i].quantity += req.body.quantity
      // 如果修改後的商品數量小於1，從購物車陣列中刪除該商品
      if (user.cart[i].quantity < 1) {
        user.cart.splice(i, 1)
      }
      // 如果購物車沒有這個商品，findIndex()傳回的值會是 -1，且商品數量 > 0，放進購物車
    } else if (req.body.quantity > 0) {
      user.cart.push(req.body)
    }
    // 保存
    await user.save()
    res.status(StatusCodes.OK).json({
      result: user.cart,
    })
  } catch (error) {
    if (error.message === 'USER ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '使用者ID格式錯誤',
      })
    } else if (error.message === 'USER NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '使用者不存在',
      })
    } else if (error.message === 'PRODUCT ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '商品ID格式錯誤',
      })
    } else if (error.message === 'PRODUCT NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '商品不存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}
export const getCart = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('USER ID')
    }
    const result = await User.findById(req.params.id, 'cart') // 限制只查'cart'欄位
      // .populate('ref欄位的位置','指定目標只顯示哪欄位')
      .populate('cart.product', 'name price') // 意思是ref在cart欄位裡的product欄位，只取product的name和price欄位。
    res.status(StatusCodes.OK).json({
      result,
    })
  } catch (error) {
    if (error.message === 'USER ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '使用者ID格式錯誤',
      })
    } else if (error.message === 'USER NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '使用者不存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}
