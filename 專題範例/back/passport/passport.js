import passport from 'passport'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import User from '../models/user.js'

/* 用驗證策略定義自己的驗證方式
passport.use(驗證方式，驗證策略(策略設定,策略執行後處理))
passportLocal :一個帳號密碼驗證策略，作用是檢查帳號密碼欄位有沒有值。
*/
passport.use('login',new passportLocal.Strategy(
  // 設定檢查的欄位名稱，預設是 username 和 password
  {
    usernameField:'account',
    passwordField:'password',
  },
  async(account,password,done)=>{
    try {
      // 檢查帳號是否存在
      const user = await User.findOne({account}).orFail(new Error('不存在的帳號'))
      // 檢查密碼是否正確
      const match = await bcrypt.compare(password,user.password)
      if(!match){
        throw new Error('密碼錯誤')
      }
      // 驗證成功，下一步
      done(null,user)
    } catch (error) {
      // 驗證失敗，錯誤帶到下一步
      done(error)
    }
  }
))