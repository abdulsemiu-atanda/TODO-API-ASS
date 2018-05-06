import request from 'supertest'
import {expect} from 'chai'

import app from '../../server/app'
import db from '../../server/models'
import {fakeRegularUser, fakeUser, fakeRoleUser} from '../testdata'

let fakeAdminToken
let fakeUserToken

describe('AP1 V1 Users', () => {
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
        done()
      })
  })

  after(() => db.Role.sequelize.sync({ force: true }))

  context('POST /users', () => {
    it('does not create user with non-existing role', done => {
      request(app)
        .post('/api/v1/users').send(fakeRoleUser)
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })

    it('creates user with valid request body', done => {
      request(app)
        .post('/api/v1/users').send(fakeRegularUser)
        .then(response => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Token expires in 24 hours')
          done()
        })
    })

    it('does not allow login with non-existing user', done => {
      request(app)
        .post('/api/v1/users/login').send({username: 'aaburr', password: 'happy'})
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })

    it('does not allow login with incorrect credentials', done => {
      request(app)
        .post('/api/v1/users/login').send({username: fakeRegularUser.username, password: 'happy'})
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })

    it('allows user with correct credentials log in', done => {
      request(app)
        .post('/api/v1/users/login').send({username: fakeRegularUser.username, password: fakeRegularUser.password})
        .then(response => {
          fakeUserToken = response.body.token
          expect(response.status).to.equal(200)
          done()
        })
    })
  })

  context('GET /users', () => {
    it('does not allow unauthenticated request get all users', done => {
      request(app)
        .get('/api/v1/users')
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow non-admin get all users', done => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('returns all users to admin', done => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(302)
          done()
        })
    })
  })
})