import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

export const login=passport.authenticate('login',{session:false})
