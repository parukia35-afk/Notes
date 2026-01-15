import express from 'express'
import * as user from '../controllers/user.js'

const router = express.Router()

router.post('/', user.create)
router.patch('/:id/cart', user.cart)
router.get('/:id/cart', user.getCart)

export default router
