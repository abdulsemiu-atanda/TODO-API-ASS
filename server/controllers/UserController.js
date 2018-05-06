import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {config} from 'dotenv'

config()

import BaseService from '../services/BaseService'
import db from '../models'

const UserService = new BaseService(db.User)
const secret = process.env.SECRET

class UserController {
  static create(req, res) {
    UserService.create(req.body).then(user => {
      const {username, id, RoleId, firstName, lastName} = user
      const token = jwt.sign({
        username,
        id,
        lastName,
        firstName,
        RoleId
      }, secret, {expiresIn: '24h'})
      const accessToken = bcrypt.hashSync(`${username}${id}${RoleId}`, bcrypt.genSaltSync(8))

      res.status(201).send({token, accessToken, message: 'Token expires in 24 hours'})
    }).catch(err => res.status(400).send(err.errors))
  }
  
  static update(req, res) {
    if (req.decoded.id === req.params.id) {
      UserService.update({id: req.params.id}, req.body).then(updatedUser => {
        res.status(200).send(updatedUser)
      }).catch(err => res.status(400).send(err.errors))
    } else {
      res.status(401).send({message: 'Unauthorized request'})
    }
  }
  
  static show(req, res) { 
    if ((req.params.id === req.decoded.id) || (req.decoded.RoleId === 1 && req.params.id)) {
      UserService.show({id: req.params.id}).then(user => {
        if (user)
          res.status(302).send(user)
        else
          res.status(404).send({message: `User with id ${req.params.id} not found`})
      })
    } else if (req.decoded.RoleId === 1) {
      UserService.index().then(users => {
        if (users.length)
          res.status(302).send(users)
        else
          res.status(404).send({message: 'No User Resource Found'})
      })
    } else {
      res.status(401).send({message: 'Unauthorized request'})
    }
  }
  
  static destroy(req, res) {
    if (req.decoded.id === req.params.id || req.decoded.RoleId === 1) {
      UserService.destroy({id: req.params.id}).then(response => {
        if (response.length)
          res.status(422).send({message: 'Unable to process your request'})
        else
          res.status(200).send({message: `User ${req.params.id} successfully deleted.`})
      })
    } else {
      res.status(401).send({message: 'Unauthorized request.'})
    }
  }

  static logIn(req, res) {
    UserService.show({username: req.body.username}).then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, response) => {
          const {username, id, RoleId, firstName, lastName} = user

          if (response) {
            const accessToken = bcrypt.hashSync(`${username}${id}${RoleId}`, bcrypt.genSaltSync(8))
            const token = jwt.sign({
              username,
              id,
              lastName,
              firstName,
              RoleId
            }, secret, {expiresIn: '24h'})

            res.status(200).send({token, accessToken, message: 'Log In successful'})
          } else {
            res.status(400).send({message: 'Username or password incorrect'})
          }
        })
      } else {
        res.status(400).send({message: 'Username or password incorrect'})
      }
    })
  }
}

export default UserController
