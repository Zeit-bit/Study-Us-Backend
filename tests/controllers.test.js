import { test, after, beforeEach, describe } from 'node:test'
import assert from 'assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import User from '../models/user.js'
import Task from '../models/task.js'
import bcrypt from 'bcrypt'

const api = supertest(app)

describe('Tests del routing de usuarios', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Task.deleteMany({})

    const user = new User({
      userName: 'testBoy',
      email: 'test@gmail.com',
      passwordHash: await bcrypt.hash('1234', 10)
    })
    await user.save()
  })

  test('GET /api/users responde con formato json y status code 200', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET /api/users retorna un solo usuario cuando hay uno', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    assert.strictEqual(users.length, 1)
  })

  test('POST /api/users crea un usuario exitosamente', async () => {
    const user = {
      userName: 'testBoy2',
      email: 'test2@gmail.com',
      password: '12345'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(201)

    const response = await api.get('/api/users')
    const users = response.body
    assert.strictEqual(users.length, 2)
  })

  test('POST /api/users no permite crear un usuario con email duplicado', async () => {
    const user = {
      userName: 'testBoy2',
      email: 'test@gmail.com',
      password: '12345'
    }
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400)
    assert.strictEqual(response.body.error, 'correo ya en uso')
  })

  test('GET /api/users/:id/tasks retorna las tareas del usuario', async () => {
    const user = (await api.get('/api/users')).body[0]
    const response = await api
      .get(`/api/users/${user.id}/tasks`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 0)
  })

  test('GET /api/users/:id/tasks retorna 400 si el ID está malformado', async () => {
    const response = await api
      .get('/api/users/123abc/tasks')
      .expect(400)

    assert.strictEqual(response.body.error, 'id malformado')
  })

  test('GET /api/users/:id/tasks retorna 404 si el usuario no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const response = await api
      .get(`/api/users/${fakeId}/tasks`)
      .expect(404)

    assert.strictEqual(response.body.error, 'Usuario no existe')
  })
})

describe('Tests del routing de tareas', () => {
  let user

  beforeEach(async () => {
    await User.deleteMany({})
    await Task.deleteMany({})

    user = new User({
      userName: 'testBoy',
      email: 'test@gmail.com',
      passwordHash: await bcrypt.hash('1234', 10)
    })
    await user.save()
  })

  test('GET /api/tasks responde con todas las tareas', async () => {
    const response = await api.get('/api/tasks').expect(200)
    assert.strictEqual(response.body.length, 0)
  })

  test('POST /api/tasks crea una tarea con éxito', async () => {
    const task = {
      title: 'Test Task',
      description: 'Test description',
      userId: user.id,
      date: new Date()
    }

    const response = await api
      .post('/api/tasks')
      .send(task)
      .expect(201)

    assert.strictEqual(response.body.title, task.title)
    assert.strictEqual(response.body.description, task.description)
  })

  test('GET /api/tasks/:id devuelve una tarea por id', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'Test description',
      userId: user.id,
      date: new Date()
    })
    await task.save()

    const response = await api
      .get(`/api/tasks/${task.id}`)
      .expect(200)

    assert.strictEqual(response.body.title, 'Test Task')
    assert.strictEqual(response.body.description, 'Test description')
  })

  test('GET /api/tasks/:id retorna 404 si la tarea no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const response = await api
      .get(`/api/tasks/${fakeId}`)
      .expect(404)

    assert.strictEqual(response.body.error, 'Tarea no encontrada')
  })

  test('GET /api/users/:id/tasks retorna 400 si el ID está malformado', async () => {
    const response = await api.get('/api/users/123abc/tasks')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'id malformado')
  })
})

after(async () => {
  await mongoose.connection.close()
})
