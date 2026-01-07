import { Schema, model } from 'mongoose'
import cloudinary from '../cloudinary/cloudinary.js'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱必填'],
      minlength: [1, '商品名稱最少 1 個字'],
      maxlength: [100, '商品名稱最多 100 個字'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, '商品價格必填'],
      min: [0, '商品價格最少 0 元'],
    },
    description: {
      type: String,
      maxlength: [1000, '商品描述最多 1000 個字'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, '商品類別必填'],
      enum: {
        values: ['手機', '電腦', '平板', '玩具', '食品', '衣服', '遊戲', '書籍', '其他'],
        message: '商品類別無效',
      },
    },
    sell: {
      type: Boolean,
      default: true,
      required: [true, '商品狀態必填'],
    },
    image: {
      type: String,
      required: [true, '商品圖片必填'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// 虛擬動態欄位
// schema.virtual(欄位名稱).get(資料產生方式)
schema.virtual('imageUrl').get(function () {
  // this = 現在處理的這筆資料
  const product = this
  // 用 cloudinary 圖片 id 取得圖片網址
  return cloudinary.url(product.image)
})

export default model('products', schema)
