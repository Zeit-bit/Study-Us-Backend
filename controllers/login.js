import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.js'

const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email })
  const passwordCorrect = !user || !password
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    userName: user.userName,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  response.json({ token, userName: user.username, email: user.email })
})

export default loginRouter
