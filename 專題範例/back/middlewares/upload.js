import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { SatusCodes } from 'http-status-codes'

// 設定 cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// 設定上傳
const upload = multer({
  // 設定收到檔案後要把檔案放在哪裡
  storage: new CloudinaryStorage({
    cloudinary,
  }),
  limits:{
    fileSize: 1024 * 1024,// 限制檔案大小
  }, 
  /*
  req = 請求資訊
  file = 檔案資訊
  callback(錯誤,是否允許上傳)
  */
  fileFilter:(req,file,callback)=>{
      if(['image/png','image/jpg','image/jpeg'].includes(file.mimetype)){
        callback(null,true)
      }else{
        callback(null,false)
      }
    },    
})

export default (req,res,next)=>{
  upload.single('image')(req,res,(error)=>{
    // 處理上傳錯誤
    if(error){
      res.status(SatusCodes.BAD_REQUEST).json({
        message:error.message,
      })
      // 處理上傳成功
    }else{
      next()
    }
  })
}
