import { Schema, Error, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: [true, '商品必填'],
    },
    quantity: {
      type: Number,
      required: [true, '數量必填'],
      min: [1, '數量最少是 1'],
    },
  },
  {
    versionKey: false,
  },
)

const schema = new Schema(
  {
    account: {
      type: String,
      required: [true, '帳號必填'],
      minlength: [4, '帳號最少 4 個字'],
      maxlength: [20, '帳號最多 20 個字'],
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          return validator.isAlphanumeric(value)
        },
        message: '帳號只能是英數字',
      },
    },
    cart: {
      type: [cartSchema],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
    },
    tokens: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

// mongoose 格式驗證後，存進資料庫前
// function 不要用箭頭，因為 this 代表將要保存的資料
schema.pre('save', async function () {
  // this 代表將要保存的資料
  const user = this
  // 如果密碼欄位有修改，進行加密
  if (user.isModified('password')) {
    // 驗證密碼格式
    let message = ''
    if (user.password.length < 4) {
      message = '密碼最少 4 個字'
    } else if (user.password.length > 20) {
      message = '密碼最多 20 個字'
    } else if (!validator.isAscii(user.password)) {
      message = '密碼只能是英數字'
    }
    // 密碼格式錯誤，拋出驗證錯誤
    // 用跟 mongoose 一樣的驗證錯誤格式，方便一起處理
    if (message !== '') {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message }))
      throw error
    }

    // 加密
    user.password = await bcrypt.hash(user.password, 10)
  }
  // 如果 tokens 欄位有修改，限制數量
  if (user.isModified('tokens') && user.tokens.length > 10) {
    user.tokens.shift()
  }
})

export default model('users', schema)
