import { Router } from 'express'
import jwtExtraction from '../middlewares/jwtExtraction.js'
import Task from '../models/task.js'
const tasksRouter = Router()

// GET - Retrieve all tasks from user (Protected)
tasksRouter.get('/', jwtExtraction, async (request, response, next) => {
  try {
    const { userId } = request.token
    const tasksInDB = await Task.find({ userId })
    response.json(tasksInDB)
  } catch (error) { next(error) }
})

// GET - Retrieve details of one task (Protected)
tasksRouter.get('/:id', jwtExtraction, async (request, response, next) => {
  try {
    const taskId = request.params.id
    const taskInDB = await Task.findById(taskId)
    response.json(taskInDB)
  } catch (error) { next(error) }
})

// POST - Create a new task (Protected)
tasksRouter.post('/create', jwtExtraction, async (request, response, next) => {
  try {
    const { title, description, date } = request.body
    const { userId } = request.token
    const newTask = new Task({
      userId,
      title,
      description,
      date
    })
    const newTaskInDB = await newTask.save()
    response.json(newTaskInDB)
  } catch (error) { next(error) }
})

// PUT - Update task details (Protected)
tasksRouter.put('/:id/update', jwtExtraction, async (request, response, next) => {
  try {
    const taskId = request.params.id
    const updatedTask = request.body
    const updatedTaskInDB = await Task.findByIdAndUpdate(taskId, { $set: updatedTask }, { new: true })
    response.json(updatedTaskInDB)
  } catch (error) { next(error) }
})

// DELETE - Delete a task (Protected)
tasksRouter.delete('/:id/delete', jwtExtraction, async (request, response, next) => {
  try {
    const taskId = request.params.id
    const responseFromDB = await Task.findByIdAndDelete(taskId)
    response.json(responseFromDB)
  } catch (error) { next(error) }
})

export default tasksRouter
