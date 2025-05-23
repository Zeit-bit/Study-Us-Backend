import express from 'express'
import cors from 'cors'
import usersRouter from './controllers/users.js'
import tasksRouter from './controllers/tasks.js'
import { MongoDBConnect } from './utils/config.js'
import errorHandler from './middlewares/errorHandler.js'
import unhandledRoutesHandler from './middlewares/unhandledRoutesHandler.js'

MongoDBConnect()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/tasks', tasksRouter)
app.use(errorHandler)
app.use(unhandledRoutesHandler)

export default app
