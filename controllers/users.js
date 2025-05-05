import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.js'
import Task from '../models/task.js'

const usersRouter = Router()

// Get all users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users.map(u => u.toJSON()))
})

// Get all tasks of a user
usersRouter.get('/:id/tasks', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'Usuario no existe' })
  const tasks = await Task.find({ userId: user._id })
  res.status(200).json(tasks.map(t => t.toJSON()))
})

// Post a new user
usersRouter.post('/', async (req, res, next) => {
  try {
    const { userName, email, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      userName,
      email,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser.toJSON())
  } catch (error) { next(error) }
})

export default usersRouter
