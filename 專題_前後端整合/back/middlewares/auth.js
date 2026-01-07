import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

// 使用 passport 的 login 驗證方法
// passport.authenticate(驗證方法, 設定, 驗證方法執行後處理)
// session: false = 停用 cookie
// 處理 function 的參數對應 done 的參數
export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // 如果有錯誤或沒有使用者資料
    if (error || !user) {
      if (error?.message === 'USER' || info?.message === 'Missing credentials') {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: '帳號或密碼錯誤',
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
      }
    }
    // 驗證成功
    else {
      // 將查詢到的使用者放入 req 內給後面的 controller 或 middleware 使用
      req.user = user
      // 繼續 express 的下一個動作
      next()
    }
  })(req, res, next)
}

export const token = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    // 如果有錯誤或沒有資料
    if (error || !data) {
      // jwt 錯誤，jwt 策略驗證時會發生，可能是格式錯誤、Secret 檢查錯誤等
      if (
        info instanceof jwt.JsonWebTokenError ||
        error?.message === 'EXP' ||
        error?.message === 'USER'
      ) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: '身分驗證失敗',
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
      }
    }
    // 驗證成功
    else {
      // 將查詢到的使用者放入 req 內給後面的 controller 或 middleware 使用
      req.user = data.user
      req.token = data.token
      // 繼續 express 的下一個動作
      next()
    }
  })(req, res, next)
}

export const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(StatusCodes.FORBIDDEN).json({
      message: '無權限',
    })
  } else {
    next()
  }
}
