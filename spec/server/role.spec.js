import request from 'supertest'
import {expect} from 'chai'

import app from '../../server/app'
import db from '../../server/models'
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

    it('allow admin get specified role', done => {
      request(app)
        .get('/api/v1/roles?title=Admin')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(302)
          expect(response.body.title).to.equal('Admin')
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

    it('errors when admin tries to create existing role', done => {
      request(app)
        .post('/api/v1/roles').send(fakeRole)
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })
  })

  context('PUT /roles', () => {
    it('does not allow unauthenticated request', done => {
      request(app)
        .put('/api/v1/roles/2').send({title: 'Kid'})
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow non-admin update role', done => {
      request(app)
        .put('/api/v1/roles/2').send({title: 'Kid'})
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('allows admin update role', done => {
      request(app)
        .put('/api/v1/roles/2').send({title: 'Kid'})
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(200)
          done()
        })
    })

    it('errors when admin tries to update a non-existing role', done => {
      request(app)
        .put('/api/v1/roles/40').send({title: 'Kid'})
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })
  })

  context('DELETE /roles', () => {
    it('does not allow unauthenticated request', done => {
      request(app)
        .delete('/api/v1/roles/2')
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('does not allow non-admin delete role', done => {
      request(app)
        .delete('/api/v1/roles/2')
        .set('Authorization', fakeUserToken)
        .then(response => {
          expect(response.status).to.equal(401)
          done()
        })
    })

    it('allows admin delete role', done => {
      request(app)
        .delete('/api/v1/roles/3')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(200)
          done()
        })
    })

    it('errors when admin tries to delete non-existing role', done => {
      request(app)
        .delete('/api/v1/roles/50')
        .set('Authorization', fakeAdminToken)
        .then(response => {
          expect(response.status).to.equal(400)
          done()
        })
    })
  })
})
