import mongoose, { model, Schema } from 'mongoose'

const taskSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: new Date() },
    title: { type: String, required: true },
    description: { type: String, default: 'Sin descripción' },
    completed: { type: Boolean, default: false }
  }
)

taskSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = document._id
    delete returnedObj._id
    delete returnedObj.__v
  }
})

const Task = model('Task', taskSchema)

export default Task
