import express from 'express'

import Authentication from '../middleware/auth'
import TodoController from '../controllers/TodoController'

const todoRoute = express.Router()

todoRoute.route('/')
  .get(Authentication.isLoggedIn, TodoController.show)
  .post(Authentication.isLoggedIn, TodoController.create)

todoRoute.route('/:id')
  .get(Authentication.isLoggedIn, TodoController.show)
  .delete(Authentication.isLoggedIn, TodoController.destroy)
  .put(Authentication.isLoggedIn, TodoController.update)

export default todoRoute
