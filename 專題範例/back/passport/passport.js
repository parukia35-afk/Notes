import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import User from '../models/user.js'

/* 概念:用驗證策略定義自己的驗證方式
在此範例，驗證策略就是安裝的 passport-jwt(檢查請求有無JWT) 和 passport-local(檢查請求有無帳密)
passport.use(驗證方式，驗證策略(策略設定,策略執行後處理))
passportLocal :一個帳號密碼驗證策略，作用是檢查帳號密碼欄位有沒有值。
*/
passport.use(
  'login',
  new passportLocal.Strategy(
    // 設定檢查的欄位名稱，預設是 username 和 password
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    // 檢查完後的處理
    /* 是一個函式，有三個參數
  account = 帳號欄位的值
  passport = 密碼欄位的值
  done = 驗證方法執行完成，把結果帶到下一步。有三個參數，done(錯誤,驗證結果,info)
  */
    async (account, password, done) => {
      try {
        // 檢查帳號是否存在
        const user = await User.findOne({ account }).orFail(new Error('USER'))
        // 檢查密碼是否正確
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          throw new Error('USER')
        }
        // 驗證成功，下一步
        done(null, user)
      } catch (error) {
        // 驗證失敗，錯誤帶到下一步
        done(error)
      }
    }
  )
)

passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      // 將req 傳入下面的function
      passReqToCallback: true,
      // 忽略過期檢查，因為舊換新可以允許過期的JWT
      ignoreExpiration: true,
    },
    // req 必須要設定 passReqToCallBack 才能用
    // 因為套件只給解編後的內容，不會給原本的 jwt ，所以要自己從 req拿
    // payload = jwt 內容
    async (payload, done) => {
      try{
      // 從 req 取 tokem
      const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

      // 手動檢查過期
      // 只有舊換新和登出允許過期
      // payload.exp 是過期匙間，單位是秒(所以才需要 x1000)
      // Date.now 是現在時間，單位是毫秒
      const expired = payload.exp * 1000 < Date.now()
      // 請求路徑
      // http://localhost:4000/user/abcd?aaa=111&bbb=222
      // req.originURL = /user/abcd?aaa=111&bbb=222
      // req.badUrl = /user
      // req.path = /abcd
      // req.query = { aaa:'111', bbb:'222' }
      const url = req.baseUrl + req.path
      if(expired && url !=='/user/refresh'&&url!=='/user/logout'){
        throw new Error('EXP')
      }
      // 檢查使用者是否存在，且有這個token
      const user = await User.findOne({ _id: payload._id, tokens: token }).orFail(new Error('USER'))
      // 驗證成功，下一步
      done(null, {user,token})
    }catch(error){
      // 驗證失敗，錯誤帶到下一步
      done(error)
    }
  },
  ),
)
