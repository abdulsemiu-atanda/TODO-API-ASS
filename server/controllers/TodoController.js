import BaseService from '../services/BaseService'
import db from '../models'
import {sanitize} from '../../util/util'

const TodoService = new BaseService(db.Todo)

class TodoController {
  static create(req, res) {
    TodoService.create(req.body).then(todoResource => {
      res.status(201).send(todoResource)
    }).catch(err => res.status(400).send(err.errors))
  }

  static show(req, res) {
    if (req.decoded.id === 1 && !req.params.id) {
      TodoService.index().then(todos => {
        if (todos.length)
          res.status(200).send(todos)
        else
          res.status(404).send({message: 'No todos found.'})
      })
    } else if (req.params.id) {
      TodoService.show({id: req.params.id}).then(todoResource => {
        if (todoResource)
          res.status(200).send(todoResource)
        else
          res.status(404).send({message: `Todo with id ${req.params.id} not found.`})
      })
    } else {
      res.status(401).send({message: 'Unauthorized to perform this request.'})
    }
  }

  static update(req, res) {
    TodoService.show({id: req.params.id}).then(todoResource => {
      if (todoResource.OwnerId === req.decoded.id)  {
        TodoService.update({id: req.params.id}, req.body).then(todo => {
          res.status(200).send(todo)
        })
      } else {
        res.status(401).send({message: 'Unauthorized request.'})
      }
    })
  }

  static destroy(req, res) {
    TodoService.show({id: req.params.id}).then(todoResource => {
      if (todoResource.OwnerId === req.decoded.id)  {
        TodoService.destroy({id: req.params.id}).then(todo => {
          if (todo.length)
            res.status(422).send({message: 'Unable to process your request.'})
          else
            res.status(200).send({message: `Todo with id ${req.params.id} has been deleted.`})
        })
      } else {
        res.status(401).send({message: 'Unauthorized request.'})
      }
    })
  }
}

export default TodoController
