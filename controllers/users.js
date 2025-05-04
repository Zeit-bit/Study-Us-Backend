import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
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
})

export default usersRouter
