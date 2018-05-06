import express from 'express'

import Authentication from '../middleware/auth'
import UserController from '../controllers/UserController'

const userRoute = express.Router()

userRoute.route('/')
  .post(UserController.create)
  .get(Authentication.isAdmin, UserController.show)

userRoute.route('/:id')
  .get(Authentication.isLoggedIn, UserController.show)
  .put(Authentication.isLoggedIn, UserController.update)
  .delete(Authentication.isLoggedIn, UserController.destroy)

userRoute.route('/login')
  .post(UserController.logIn)

userRoute.route('/refreshToken')
  .post(Authentication.refreshToken)

export default userRoute
