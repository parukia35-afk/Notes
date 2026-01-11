import { Schema, model } from 'mongoose'
import validator from 'validator'

// mongoose的schema定義資料有哪些欄位及型態
const schema = new Schema(
  {
    // 欄位
    account: {
      // 資料型態
      type: String,
      // 使用 mongoose 內建的資料驗證功能:
      // https://mongoosejs.com/docs/validation.html#built-in-validators
      required: [true, '帳號必填'],
      // 自訂錯誤訊息:
      // https://mongoosejs.com/docs/validation.html#custom-error-messages
      minLength: [4, '帳號須4個字以上'],
      maxLength: [20, '帳號須20個字以下'],
      // mongoose 自訂驗證語法
      // https://mongoosejs.com/docs/validation.html#custom-validators
      validate: {
        // validator後面接會return布林值的function
        // validator.isAlphanumeric(value)則是使用 validator套件
        validator: (value) => validator.isAlphanumeric(value),
        // 錯誤訊息
        message: '帳號只能是英數字',
      },
      // 自動用 .trim()去除前後空白
      trim: true,
      // 建立欄位索引，欄位的值不能重複。不算是驗證，不能設定錯誤訊息。
      unique: true,
    },
    email: {
      type: String,
      required: [true, '信箱必填'],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: '信箱格式錯誤',
      },
      unique: true,
      trim: true,
    },
  },
  {
    // 自動建立 createdAt 和 updatedAt欄位，記錄資料甚麼時候建立和更新
    // https://mongoosejs.com/docs/timestamps.html
    timestamps: true,
    // 關閉修改次數記錄欄位(老師覺得沒什麼用，可以關掉)
    versionKey: false,
  },
)

// 將資料結構轉換成可以對資料做操作的 model
// 語法: model(collection名稱,schema)
// collection名稱會自動轉成英文的複數，那不如在命名的時候就取為複數
export default model('users', schema)
