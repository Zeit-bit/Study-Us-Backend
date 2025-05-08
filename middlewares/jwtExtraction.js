import jwt from 'jsonwebtoken'

const jwtExtraction = (req, res, next) => {
  try {
    console.log('***Token Extraction***')
    const authorization = req.get('authorization')
    let token = ''
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.replace('Bearer ', '')
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    req.token = decodedToken
    next()
  } catch (error) { next(error) }
}

export default jwtExtraction
