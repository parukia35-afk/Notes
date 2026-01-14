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
    const result = await Product.find()
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
