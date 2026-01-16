import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

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

export const login = async (req, res) => {
  try {
    // 簽發JWT
    // jwt.sign(攜帶資料,驗證用secret,設定)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 將簽發的token存入使用者
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {
        account: req.user.account,
        role: req.user.role,
        cart: req.user.cart.length,
        token,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const profile = (req, res) => {
  res.status(StatusCodes.OK).json({
    result: {
      account: req.user.account,
      role: req.user.role,
      cart: req.user.cart.length,
    },
  })
}

export const refresh = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[i] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {
        token,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const logout = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    req.user.tokens.splice(i, 1)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {},
    })
  }catch(error){
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

