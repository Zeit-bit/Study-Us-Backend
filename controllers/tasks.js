import { Router } from 'express'
import Task from '../models/task.js'
import User from '../models/user.js'
import tokenExtraction from '../middlewares/tokenExtraction.js'

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
  res.status(200).json(task)
})

// Post a user task
tasksRouter.post('/', tokenExtraction, async (req, res) => {
  const { title, description, date } = req.body
  const user = await User.findById(req.userId)
  const task = new Task({
    userId: user._id,
    date,
    title,
    description
  })
  const savedTask = await task.save()
  res.status(201).json(savedTask)
})

// Delete a user task
tasksRouter.delete('/', tokenExtraction, async (req, res) => {
  const { taskId } = req.body
  const task = await Task.findByIdAndDelete(taskId)
  if (!task) return res.status(404).json({ error: 'id not found' })
  res.json({ success: 'task removed', id: task._id })
})

// Modify a task
tasksRouter.put('/', tokenExtraction, async (req, res) => {
  const { taskId, completed } = req.body
  const task = await Task.findByIdAndUpdate(taskId, { completed }, { new: true })
  if (!task) return res.status(404).json({ error: 'id not found' })
  res.json(task)
})

export default tasksRouter
