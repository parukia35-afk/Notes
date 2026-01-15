import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    const result = new User(req.body)
    await result.save()
    res.status(StatusCodes.CREATED).json({
      result,
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        message,
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        // 409 : 請求與目標資源的當前狀態存在衝突
        message: '帳號重複',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}
