## Description

Kanban Board API

## Installation

```bash
# using docker
docker build . -t <dockerImageName>
```

```bash
$ npm install
```

## Running the app

```bash
# docker initialization
docker run -p 3000:3000 -d <dockerImageName>
```

or with NPM

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage

At first run the app will create the the user:
username: admin
password: 1234

## Routes

```bash
# POST: login user and return a JWT Token
http://localhost:3000/auth/login
```

All the routes above need the JWT Token at request

```bash
# This route implements all HTTP methods
# GET: returns all board list
# POST: create board
# PATCH/{id}: update board
# DELETE/{id}: delete board
http://localhost:3000/boards
```

```bash
# This route implements all HTTP methods
# GET: returns all lists
# POST: create list
# PATCH/{id}: update list
# DELETE/{id}: delete list
http://localhost:3000/lists
```

```bash
# This route implements all HTTP methods
# GET: returns all task list
# POST: create task
# PATCH/{id}: update task
# DELETE/{id}: delete task
http://localhost:3000/tasks
```

```bash
# This route implements all HTTP methods
# GET: returns all user list
# POST: create user
# PATCH/{id}: update user
# DELETE/{id}: delete user
http://localhost:3000/users
```

## Author

- [Filipe Augusto Gonçalves](https://www.linkedin.com/in/filipe-augusto/)

## License

Nest is [MIT licensed](LICENSE).
