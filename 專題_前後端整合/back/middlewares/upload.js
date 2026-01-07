import multer from 'multer'
import cloudinary from '../cloudinary/cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// 設定上傳
const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
  }),
  limits: {
    fileSize: 1024 * 1024,
  },
  // req = 請求資訊
  // file = 檔案資訊
  // callback(錯誤, 是否允許上傳)
  fileFilter: (req, file, callback) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
})

export default (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    // 處理上傳錯誤
    if (error) {
      console.log(error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '上傳失敗',
      })
    }
    // 處理上傳成功
    else {
      console.log(req.file)
      next()
    }
  })
}
