import express from 'express'

import Authentication from '../middleware/auth'
import RoleController from '../controllers/RoleController'

const roleRoutes = express.Router()

roleRoutes.route('/')
  .get(Authentication.isAdmin, RoleController.show)
  .post(Authentication.isAdmin, RoleController.create)

roleRoutes.route('/:id')
  .delete(Authentication.isAdmin, RoleController.destroy)
  .put(Authentication.isAdmin, RoleController.update)

export default roleRoutes