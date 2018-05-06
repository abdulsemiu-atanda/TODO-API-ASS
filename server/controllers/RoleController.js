import jwt from 'jsonwebtoken'

import BaseService from '../services/BaseService'
import db from '../models'

const RoleService = new BaseService(db.Role)

class RoleController {
  static create(req, res) {
    RoleService.create({title: req.body.title}).then(role => {
      res.status(201).send(role)
    }).catch(err => {
      res.status(400).send(err.errors)
    })
  }

  static show(req, res) {
    if (req.query.title) {
      RoleService.show({title: req.query.title}).then(role => {
        if (role)
          res.status(302).send(role)
        else
          res.status(404).send({message: `Role with title ${req.query.title} not found.`})
      })
    } else {
      RoleService.index().then(roles => {
        if (roles.length)
          res.status(302).send(roles)
        else
          res.status(404).send({message: 'Roles not found.'})
      })
    }
  }

  static update(req, res) {
    RoleService.update({id: req.params.id}, req.body).then(updatedRole => {
      res.status(200).send(updatedRole)
    }).catch(err => res.status(400).send(err.errors))
  }

  static destroy(req, res) {
    RoleService.destroy({id: req.params.id}).then(response => {
      if (response.length)
        res.status(422).send({message: 'Unable to process your request'})
      else
        res.status(200).send({message: `Role with id ${req.params.id} successfully deleted`})
    }).catch(err => res.status(400).send(err.errors))
  }
}

export default RoleController
