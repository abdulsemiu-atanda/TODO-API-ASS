import faker from 'faker'

export const fakeUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  RoleId: 1
}

export const fakeRegularUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  RoleId: 2
}

export const fakeRoleUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  RoleId: 12
}

export const nullAttributeUser = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  RoleId: 1
}

export const noRoleUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password()
}

export const fakeRole = {
  title: faker.name.jobTitle()
}

export const invalidRole = {
  title: faker.commerce.price
}

export const fakeTodo = {
  title: faker.lorem.words(),
  description: faker.lorem.paragraph(),
  OwnerId: 1
}

export const noOwnerTodo = {
  title: faker.lorem.words(),
  description: faker.lorem.paragraph()
}

export const invalidStatusTodo = {
  title: faker.lorem.words(),
  description: faker.lorem.paragraph(),
  status: faker.lorem.word(),
  OwnerId: 1
}

export const noTitleTodo = {
  description: faker.lorem.paragraph(),
  status: faker.lorem.word(),
  OwnerId: 1
}