import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwtExtraction from '../middlewares/jwtExtraction.js'

const usersRouter = Router()

// POST - Register users
usersRouter.post('/register', async (request, response, next) => {
  try {
    const { username, email, password } = request.body
    const passwordHash = await bcrypt.hash(password, 10)
    const userToRegister = new User({
      username,
      email,
      passwordHash
    })
    const userInDB = await userToRegister.save()
    response.json(userInDB)
  } catch (error) { next(error) }
})

// POST - Login users
usersRouter.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body
    const userInDB = await User.findOne({ email })
    const passwordCorrect = userInDB && password
      ? await bcrypt.compare(password, userInDB.passwordHash)
      : false

    if (!passwordCorrect) return response.status(401).json({ error: 'invalid email or password' })

    const tokenBeforeSigning = {
      userId: userInDB._id,
      username: userInDB.username
    }

    const token = jwt.sign(tokenBeforeSigning, process.env.SECRET, { expiresIn: 60 * 60 })
    response.json({ token, username: userInDB.username, email: userInDB.email })
  } catch (error) { next(error) }
})

// GET - View profile (Protected)
usersRouter.get('/profile', jwtExtraction, async (request, response, next) => {
  try {
    const { userId } = request.token
    const userInDB = await User.findById(userId)
    response.json(userInDB)
  } catch (error) { next(error) }
})

// PUT - Update profile data (Protected)
usersRouter.put('/profile/update', jwtExtraction, async (request, response, next) => {
  try {
    const { userId } = request.token
    const updatedUser = request.body
    const updatedUserInDB = await User.findByIdAndUpdate(userId, updatedUser, { new: true })
    response.json(updatedUserInDB)
  } catch (error) { next(error) }
})

export default usersRouter
