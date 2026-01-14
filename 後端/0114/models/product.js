import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱必填'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, '價格必填'],
      min: [0, '價格不得小於0'],
    },
    category: {
      type: String,
      required: [true, '商品類別必填'],
      enum: {
        // 定義欄位只能是提供德的值
        values: ['遊戲', '音樂', '手機'],
        message: '查無{VALUE}分類', // 當輸入的values不屬於enum時，{VALUE}會自動取代成打錯的東西
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

// 在 name 欄位建立文字索引，以利後續可以搜尋關鍵字
schema.index({ name: 'text' })

export default model('products', schema)
