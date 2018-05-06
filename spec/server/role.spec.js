import request from 'supertest'
import {expect} from 'chai'

import app from '../../app'
import db from '../../models'
import {fakeUser, fakeRegularUser, fakeRole} from '../testdata'

let fakeAdminToken
let fakeUserToken

describe('API V1 Roles', () => {
  before(done => {
    db.Role.bulkCreate([{
      title: 'Admin'
    },
    {
      title: 'Regular'
    }]);
    db.User.sync({ force: true }).then(() => {
      request(app)
        .post('/api/v1/users').send(fakeUser)
        .then(res => {
          fakeAdminToken = res.body.token;
          request(app)
            .post('/api/v1/users').send(fakeRegularUser)
            .then(response => {
              fakeUserToken = response.body.token;
              done();
            });
        });
    });
  })

  after(() => db.Role.sequelize.sync({ force: true }))

  context('GET /roles', () => {
    it('returns a welcome message', done => {
      request(app)
      .get('/api')
      .then(response => {
        expect(response.body.message).to.equal('Welcome to TODO API')
        done()
      })
    })
  
    it('does not allow unauthenticated request fetch roles', done => {
      request(app)
      .get('/api/v1/roles')
      .then(response => {
        expect(response.status).to.equal(401)
        done()
      })
    })
  
    it('does not allow non-admins fetch roles', done => {
      request(app)
      .get('/api/v1/roles')
      .set('Authorization', fakeUserToken)
      .then(response => {
        expect(response.status).to.equal(401)
        done()
      })
    })

    it('returns all roles to admin', done => {
      request(app)
        .get('/api/v1/roles')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(302)
          done()
        })
    })
  })

  context('POST /roles', () => {
    it('does not allow non-admin create role', done => {
      request(app)
        .post('/api/v1/roles').send(fakeRole)
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow unauthenticated user create role', done => {
      request(app)
        .post('/api/v1/roles').send(fakeRole)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('allows admin create role', done => {
      request(app)
        .post('/api/v1/roles').send(fakeRole)
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(201)
          done()
        })
    })
  })

})