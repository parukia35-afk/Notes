import express from 'express'
import * as product from '../controllers/product.js'

const router = express.Router()

router.post('/', product.create)

export default router
