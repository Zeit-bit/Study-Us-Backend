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
  } catch (err) {
    next(err)
  }
  req.userId = decodedToken.id
  next()
}

export default tokenExtraction
