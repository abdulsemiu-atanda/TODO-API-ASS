import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import bcrypt from 'bcrypt'

config()

const secret = process.env.SECRET

class Authentication {
  static verify(token) {
    try {
      const decoded = jwt.verify(token, secret)
      return decoded
    }
    catch (err) {
      return false
    }
  }

  static isAdmin(req, res, next) {
    const user = Authentication.verify(req.headers.authorization)
    
    if (user && user.RoleId === 1)
      next()
    else
      res.status(401).send({message: 'User not authorized'})
  }

  static isLoggedIn(req, res, next) {
    const user = Authentication.verify(req.headers.authorization)
  
    if (user) {
      req.decoded = user
      next()
    } else {
      res.status(401).send({message: "You're not logged in!"})
    }
  }

  static refreshToken(req, res) {
    const {username, firstName, lastName, RoleId, id} = jwt.decode(req.headers.authorization)

    if (bcrypt.compareSync(`${username}${id}${RoleId}`, req.body.accessToken)) {
      const token = jwt.sign({
        username,
        id,
        firstName,
        lastName,
        RoleId
      }, secret, {expiresIn: '48h'})

      res.status(200).send({accessToken: req.body.accessToken, token})
    } else {
      res.status(422).send({message: 'Unable to process request.'})
    }
  }
}

export default Authentication