import jwt from 'jsonwebtoken'

const tokenExtraction = (req, res, next) => {
  console.log('***Token Extraction***')
  const authorization = req.get('authorization')
  let token = ''
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
  }
  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (err) {}
  if (!decodedToken.id) return res.status(401).json({ error: 'token missing or invalid' })
  req.userId = decodedToken.id
  next()
}

export default tokenExtraction
