import { model, Schema } from 'mongoose'

const cartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId, // 如果要儲存的資料型態是mongoDB ID的話，它有自己定義的資料型態叫Schema.Types.ObjectId
      ref: 'products', // ref表示type中的id是哪裡來的，是從products這個collection來的。使用 .populate()可帶出id對應的資料。
      required: [true, '商品必填'],
    },
    quantity: {
      type: Number,
      required: [true, '數量必填'],
      min: [1, '數量至少為1'],
    },
  },
  {
    versionKey: false,
    // timestamps: true, 購物車不需要記錄商品被加入購物車的時間。
  },
)

const schema = new Schema(
  {
    account: {
      type: String,
      required: true,
      trim: true,
    },
    cart: {
      type: [cartSchema], // [String]表字串組成的陣列
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('users', schema)
