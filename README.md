# TODO-API-ASS
Simple CRUD TODO API

## Prerequisite
- [NodeJS](https://nodejs.org)
- [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started.html) CLI
- PostgreSQL

## Installation
- Clone this repository
- Add `.env` file as described in `.env.example`
- Change your directory `$ cd TODO-API-ASS`
- Install packages with `$ npm install`
- Migrate database with `$ sequelize db:migrate`

## Usage
- Start development environment with `$ npm run start:dev`
- If you would like to use production build instead
  - Generate production build with `$ npm run build`
  - Copy sequelize config with `$ npm run config`
  - Start application with `$ npm start`

## Testing
- Migrate test database with `$ NODE_ENV=test sequelize db:migrate`
- Run Tests with `$ npm test`

## Endpoints
### Roles
- GET `/api/v1/roles`
- POST `/api/v1/roles`
  1. Example body
    ```json
      {"title": "regular"}
    ```
- PUT `/api/v1/roles/:id`
  1. Example body
    ```json
      {"title": "super admin"}
    ```
- DELETE `/api/v1/roles/:id`

### Users
- GET `/api/v1/users`, `/api/v1/users/:id`, `/api/v1/users/refreshToken`
- POST `/api/v1/users`
  1. Sample login request body
    ```json
      {
        "username": "aaburr",
        "password": "revolution"
      }
    ```
  2. Sample signup request body
    ```json
      {
        "username": "ahamilton",
        "email": "alexander@hamilton.com",
        "firstName": "Alexamder",
        "lastName": "Hamilton",
        "password": "revolution",
        "RoleId": 12
      }
    ```
- PUT `/api/users/:id`
  1. Sample request body
    ```json
      {
        "firstName": "Alex",
        "RoleId": 1
      }
    ```
- DELETE `/api/users/:id`

### Todos
- GET `/api/v1/todos`, `/api/v1/todos/:id`
- POST `/api/v1/todos`
  1. Sample request body
    ```json
      {
        "title": "Reading",
        "description": "Get Moby Dick from Barnes and Noble",
        "OwnerId": 1
      }
    ```
- PUT `/api/v1/todos/:id`
  1. Sample request body
    ```json
      {
        "status": "completed"
      }
    ```
- DELETE `/api/v1/todos/:id`