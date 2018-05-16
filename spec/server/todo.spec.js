import request from 'supertest'
import {expect} from 'chai'
import faker from 'faker'

import app from '../../server/app'
import db from '../../server/models'
import {fakeRegularUser, fakeUser, fakeTodo, noOwnerTodo, fakeUserTodo} from '../testdata'

let fakeAdminToken
let fakeUserToken
const updateAtrribute = {title: faker.name.jobTitle()}

describe('API V1 Todo', () => {
  before(done => {
    db.Role.bulkCreate([{
      title: 'Admin'
    },
    {
      title: 'Regular'
    }])
    request(app)
      .post('/api/v1/users').send(fakeUser)
      .then(response => {
        fakeAdminToken = response.body.token
        request(app)
        .post('/api/v1/users').send(fakeRegularUser)
        .then(res => {
          fakeUserToken = res.body.token
          done()
        })
      })
  })

  after(() => db.Role.sequelize.sync({ force: true }))

  context('POST /todos', () => {
    it('does not create todo for an unauthorized request', done => {
      request(app)
        .post('/api/v1/todos').send(fakeTodo)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })
  
    it('does not create todo without a owner', done => {
      request(app)
        .post('/api/v1/todos').send(noOwnerTodo)
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })
    it('creates todo for authorized user', done => {
      request(app)
        .post('/api/v1/todos').send(fakeUserTodo)
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(201)
          done()
        })
    })

    it('allows admin create todo', done => {
      request(app)
        .post('/api/v1/todos').send(fakeTodo)
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(201)
          done()
        })
    })
  })

  context('GET /todos', done => {
    it('does not allow unauthorized request', done => {
      request(app)
        .get('/api/v1/todos')
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow non admin fetch all todos', done => {
      request(app)
        .get('/api/v1/todos')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('returns all todos to admin', done => {
      request(app)
        .get('/api/v1/todos')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.length.greaterThan(0)
          done()
        })
    })

    it('does not allow user get todo with a non-existing id', done => {
      request(app)
        .get('/api/v1/todos/35')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(404)
          done()
        })
    })
  })

  context('PUT /todos', () => {
    it('does not allow unauthenticated update request', done => {
      request(app)
        .put('/api/v1/todos/1').send(updateAtrribute)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow user update todo that they do not own', done => {
      request(app)
        .put('/api/v1/todos/2').send(updateAtrribute)
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('allows user update their todo', done => {
      request(app)
        .put('/api/v1/todos/1').send(updateAtrribute)
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(200)
          done()
        })
    })
  })

  context('DELETE /todos', () => {
    it('does not allow unauthenticated delete request', done => {
      request(app)
        .delete('/api/v1/todos/1')
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow user delete todo that they do not own', done => {
      request(app)
        .delete('/api/v1/todos/2')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('allows user delete their todo', done => {
      request(app)
        .delete('/api/v1/todos/1')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(200)
          done()
        })
    })
  })
})