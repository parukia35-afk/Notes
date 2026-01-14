import { StatusCodes } from 'http-status-codes'
import User from '../models/user.js'

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
export const cart = async (req, res) => {}
export const getCart = async (req, res) => {}
