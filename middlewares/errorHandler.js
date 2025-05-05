const ErrorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') return res.status(400).send({ error: 'id malformado' })
  if (error.name === 'ValidationError') return res.status(400).send({ error: error.message })
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) return res.status(400).json({ error: 'correo ya en uso' })
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'token invalido' })
  if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'token expirado' })
  console.log(error)
  next(error)
}

export default ErrorHandler
