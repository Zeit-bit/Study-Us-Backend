import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

const users = []

app.use(express.json())
app.use(cors())

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  const userData = await req.body
  const user = users.find((user) => user.email === userData.email)
  if (user) return res.json({ error: 'correo electronico ya en uso' })
  users.push(userData)
  res.json({ msg: 'Creado exitosamente' })
})

app.post('/login', async (req, res) => {
  const userData = await req.body
  const user = users.find((user) => user.email === userData.email)
  if (!user) return res.json({ error: 'No existe el usuario' })
  if (user.password !== userData.password) {
    return res.json({ error: 'Contraseña incorrecta' })
  }

  res.json(user)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
