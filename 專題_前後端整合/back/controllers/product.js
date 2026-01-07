import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'
import cloudinary from '../cloudinary/cloudinary.js'

export const create = async (req, res) => {
  try {
    const result = new Product({ ...req.body, image: req.file.filename })
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
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}

export const getAll = async (req, res) => {
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

export const update = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('ID')
    }

    const result = await Product.findById(req.params.id).orFail(new Error('ID'))

    // 更新不一定有圖片.
    // 沒有圖片就是沿用舊的
    // 有圖片，刪除舊圖檔
    if (req.file) {
      await cloudinary.uploader.destroy(result.image)
      result.image = req.file.filename
    }
    // 更新其他資料
    result.set(req.body)

    await result.save()

    res.status(StatusCodes.OK).json({
      result,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        message,
      })
    } else if (error.message === 'ID') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '找不到商品',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}
