import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱必填'],
    minlength: [1, '商品名稱最少1個字'],
    maxlength: [20, '商品名稱最多20個字'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, '商品價格必填'],
    min: [0, '商品價格至少為0'],
  },
  description: {
    type: String,
    maxlength: [1000, '商品描述最多1000個字'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '商品類別必填'],
    enum: {
      value: ['3C', '玩具', '服飾', '遊戲', '食品', '其他'],
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
}, {
  versionKey: false,
  timestamps: true,
})

export default model('product', schema)
