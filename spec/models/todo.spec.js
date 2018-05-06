import {expect} from 'chai'

import db from '../../server/models'
import {fakeRole, fakeUser, fakeTodo, invalidStatusTodo, noOwnerTodo, noTitleTodo} from '../testdata'

const Todo = db.Todo
const Role = db.Role
const User = db.User
let user
let role
let todo

describe('Todo Model', () => {
  before(() => {
    role = Role.build(fakeRole)
    user = User.build(fakeUser)
    todo = Todo.build(fakeTodo)
    role.save()
    user.save()
  })

  after(() => Role.sequelize.sync({ force: true }))

  it('creates a todo instance', () => expect(todo).to.exist)

  it('saves todo correctly', () => {
    todo.save().then(savedTodo => {
      expect(savedTodo.title).to.equal(fakeTodo.title)
      expect(savedTodo.description).to.equal(fakeTodo.description)
      expect(savedTodo.status).to.equal('pending')
    })
  })

  it('does not save todo without an owner', () => {
    Todo.create(noOwnerTodo).then(savedTodo => expect(savedTodo).to.not.exist)
      .catch(err => expect(err.errors[0].message).to.equal('Todo.OwnerId cannot be null'))
  })

  it('does not create a todo with invalid status', () => {
    Todo.create(invalidStatusTodo).then(savedTodo => expect(savedTodo).to.not.exist)
      .catch(err => expect(err).to.exist)
  })

  it('does not save todo without title', () => {
    Todo.create(noTitleTodo).then(savedTodo => expect(savedTodo).to.not.exist)
      .catch(err => expect(err.errors[0].message).to.equal('Todo.title cannot be null'))
  })
})