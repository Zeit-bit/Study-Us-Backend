import { Router } from 'express'
import Task from '../models/task.js'
import User from '../models/user.js'

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
  const { title, description, userId, date } = req.body
  const user = await User.findById(userId)
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
