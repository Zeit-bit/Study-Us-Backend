import { config } from 'dotenv'
import mongoose from 'mongoose'
config()

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

const MongoDBConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Conectado a la base de datos')
  } catch (err) {
    console.log('Error al conectar', err)
  }
}
export { PORT, MongoDBConnect }
