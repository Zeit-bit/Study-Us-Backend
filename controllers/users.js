import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.js'
import Task from '../models/task.js'

const usersRouter = Router()

// Get all users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Get all tasks of a user
usersRouter.get('/:id/tasks', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'invalid user id' })
  const tasks = await Task.find({ userId: user._id })
  res.json(tasks)
})

// Post a new user
usersRouter.post('/', async (req, res, next) => {
  try {
    const { userName, email, password } = req.body

    if (!password) return res.json({ error: 'missing password' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      userName,
      email,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) { next(error) }
})

export default usersRouter
