import {expect} from 'chai'
import bcrypt from 'bcrypt'

import BaseService from '../../services/BaseService'
import db from '../../models'
import {fakeRole, fakeUser, fakeTodo} from '../testdata'


const RoleService = new BaseService(db.Role)
const UserService = new BaseService(db.User)
const TodoService = new BaseService(db.Todo)

describe('BaseService', () => {
  before(() => RoleService.create(fakeRole))

  after(() => RoleService.model.sequelize.sync({ force: true }))

  context('Create', () => {
    it('returns a promise of created user', done => {
      UserService.create(fakeUser).then(user => {
        expect(user.email).to.equal(fakeUser.email)
        expect(user.firstName).to.equal(fakeUser.firstName)
        expect(bcrypt.compareSync(fakeUser.password, user.password)).to.be.true;
        done()
      })
    })
  
    it('returns a promise of created Todo', done => {
      TodoService.create(fakeTodo).then(savedTodo => {
        expect(savedTodo.title).to.equal(fakeTodo.title)
        expect(savedTodo.description).to.equal(fakeTodo.description)
        expect(savedTodo.status).to.equal('pending')
        done()
      })
    })
  })

  context('Index', () => {
    it('returns all created users', done => {
      UserService.index().then(users => {
        expect(users).to.be.instanceof(Array)
        expect(users.length).to.be.above(0)
        done()
      })
    })

    it('returns all roles', done => {
      RoleService.index().then(roles => {
        expect(roles).to.be.instanceof(Array)
        expect(roles.length).to.be.above(0)
        done()
      })
    })

    it('returns all todos', done => {
      TodoService.index().then(todos => {
        expect(todos).to.be.instanceof(Array)
        expect(todos.length).to.be.above(0)
        done()
      })
    })
  })

  context('Update', () => {
    it('updates user and returns updated user', done => {
      UserService.update({id: 1}, {firstName: 'Jack'}).then(updatedUser => {
        expect(updatedUser.firstName).to.equal('Jack')
        done()
      })
    })

    it('updates role and returns updated role', done => {
      RoleService.update({id: 1}, {title: 'Admin'}).then(updatedRole => {
        expect(updatedRole.title).to.equal('Admin')
        done()
      })
    })

    it('updates todo and returns updated todo', done => {
      TodoService.update({id: 1}, {title: 'Get Moby Dick'}).then(updatedTodo => {
        expect(updatedTodo.title).to.equal('Get Moby Dick')
        done()
      })
    })
  })

  context('Show', () => {
    it('returns a specified user resource', done => {
      UserService.show({username: fakeUser.username}).then(user => {
        expect(user.username).to.equal(fakeUser.username)
        expect(user).to.be.instanceof(Object)
        done()
      })
    })

    it('returns a specified role resource', done => {
      RoleService.show({id: 1}).then(role => {
        expect(role.title).to.equal('Admin')
        expect(role).to.exist
        done()
      })
    })

    it('returns a specified todo resource', done => {
      TodoService.show({title: 'Get Moby Dick'}).then(todo => {
        expect(todo.title).to.equal('Get Moby Dick')
        expect(todo).to.exist
        done()
      })
    })
  })

  context('Destroy', () => {
    it('destroys specified role', done => {
      RoleService.destroy({id: 1}).then(response => {
        expect(response.length).to.equal(0)
        done()
      })
    })

    it('destroys user when role is deleted', done => {
      UserService.show({RoleId: 1}).then(user => {
        expect(user).to.not.exist
        done()
      })
    })

    it('destroys todo when role is deleted', done => {
      UserService.show({id: 1}).then(todo => {
        expect(todo).to.not.exist
        done()
      })
    })
  })
})