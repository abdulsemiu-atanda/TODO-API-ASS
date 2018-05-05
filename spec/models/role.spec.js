import {expect} from 'chai'

import db from '../../models'
import {fakeRole, invalidRole} from '../testdata'

let role
const Role = db.Role

describe('Role Model', () => {
  before(() => {
    role = Role.build(fakeRole)
  })

  after(() => Role.sequelize.sync({ force: true }))

  it('creates an instance of role', () => expect(role).to.exist)

  it('saves new role with correct value', () => {
    role.save().then(savedRole => expect(savedRole.title).to.equal(fakeRole.title))
  })

  it('does not create title with invalid type', () => {
    role = Role.build(invalidRole)

    role.save().then(savedRole => expect(savedRole).to.not.exist)
      .catch(err => expect(err.errors[0].type).to.equal('string violation'))
  })

  it('does not save empty title', () => {
    Role.create({}).then(savedRole => expect(savedRole).to.not.exist)
      .catch(err => expect(err.errors[0].type).to.equal('notNull Violation'))
  })
})