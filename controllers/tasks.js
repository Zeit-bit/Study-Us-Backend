import { Router } from 'express'
import Task from '../models/task.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const GetTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tasksRouter = Router()

// Get all tasks
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({})
  res.status(200).json(tasks)
})

// Get task by id
tasksRouter.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' })
  res.status(200).json(task.toJSON())
})

// Post a task
tasksRouter.post('/', async (req, res) => {
  const { title, description, date } = req.body
  const decodedToken = jwt.verify(GetTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalido' })
  }
  const user = await User.findById(decodedToken.id)
  const task = new Task({
    userId: user._id,
    date,
    title,
    description
  })
  const savedTask = await task.save()
  res.status(201).json(savedTask.toJSON())
})

export default tasksRouter
