import faker from 'faker'
import {expect} from 'chai'
import bcrypt from 'bcrypt'
import db from '../../server/models'
import {fakeUser, fakeRoleUser, fakeRole, nullAttributeUser, noRoleUser} from '../testdata'

const Role = db.Role
const User = db.User
let role
let user

describe('User Model', () => {
  before(done => {
    role = Role.build(fakeRole)
    user = User.build(fakeUser)
    role.save()
    done()
  })

  it('user model instance should exist', () => expect(user).to.exist)

  it('should save correct attributes to database with password not plain', done => {
    user.save()
    .then(saveUser => {
      expect(saveUser.username).to.equal(fakeUser.username);
      expect(saveUser.lastName).to.equal(fakeUser.lastName);
      expect(saveUser.password).to.not.equal(fakeUser.password);
      expect(bcrypt.compareSync(fakeUser.password, saveUser.password)).to.be.true;
      done()
    });
  });

  it('should update user correctly', done => {
    const firstName = faker.name.firstName()
    User.findOne({where: {username: fakeUser.username}}).then(response => {
      // existence check here to prevent NDF
      response && response.update({firstName}).then(result => {
        expect(result.firstName).to.equal(firstName)
        done()
      })
    })
  })

  it('should not create new user with existing unique attribute', () => {
    User.create(fakeUser)
      .then(duplicate => expect(duplicate).to.not.exist)
      .catch(err => expect(err.errors[0].message).to.equal('email must be unique'))
  })

  it('should not create user with non-existing role', () => {
    User.create(fakeRoleUser)
      .then(savedUser => expect(savedUser).to.not.exist)
      .catch(err => {
        expect(err.message).to.equal('insert or update on table "Users" violates foreign key constraint "Users_RoleId_fkey"')
      })
  })

  it('it does not create user with a missing notNull attribute', () => {
    user = User.build(nullAttributeUser)
    user.save().then(savedUser => expect(savedUser).to.not.exist)
      .catch(err => expect(/notNull/.test(err.message)).to.be.true)
  })

  it('does not create user with no role', () => {
    User.create(noRoleUser).then(savedUser => {
      expect(savedUser).to.not.exist
    }).catch(err => {
      expect(err.errors[0].message).to.equal('User.RoleId cannot be null')
    })
  })

  after(() => Role.sequelize.sync({ force: true }))
})