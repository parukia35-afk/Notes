import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

/* 使用 passport 的 login 驗證方法
語法:passport.authenticate('驗證方法',設定,驗證方法執行後的處理)
// session:false --->停用cookie
// 驗證方法執行後的處理的function的參數對應 done 的參數
*/
export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // 如果有錯誤或沒有使用者資料
    if (error || !user) {
      if (error?.message === 'USER' || info?.messae === 'Missing credentials') {
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
      req.user = user // 將查詢到的使用者放入req內給後面的controller或middleware使用
      next()
    }
  })(req, res, next)
}

export const token = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    // 如果有錯誤或沒有資料
    if (error || !data) {
      // jwt 錯誤，jwt 策略驗證時會發生，可能是格式錯誤、Secret檢查錯誤等
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
      req.user = data.user
      req.token = data.token
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
