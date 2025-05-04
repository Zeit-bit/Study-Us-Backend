import { Router } from 'express'
import Task from '../models/task.js'
import User from '../models/user.js'

const tasksRouter = Router()

tasksRouter.get('/:id', async (req, res) => {
  console.log(req.params.id)
  const user = await User.findById(req.params.id)
  const tasks = await Task.find({ userId: user._id })
  res.json(tasks)
})

tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({})
  res.status(200).json(tasks)
})

tasksRouter.post('/', async (req, res) => {
  const { title, description, userId } = req.body
  const user = await User.findById(userId)
  console.log(user._id)
  const task = new Task({
    userId: user._id,
    title,
    description
  })
  const savedTask = await task.save()
  res.json(savedTask)
})

export default tasksRouter
