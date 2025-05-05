const errorHandlers = {
  CastError: (res) => res.status(400).json({ error: 'malformed id' }),
  ValidationError: (res, { message }) => res.status(400).json({ error: message }),
  JsonWebTokenError: (res) => res.status(401).json({ error: 'token missing or invalid' }),
  TokenExpiredError: (res) => res.status(401).json({ error: 'token expired' }),
  MongoServerError: (res) => res.status(400).json({ error: 'duplicate field in database' }),
  defaultError: (res) => res.status(500).end()
}

const errorHandler = (error, req, res, next) => {
  console.log('***Error Handling***')
  console.log(error.name)
  const handler = errorHandlers[error.name] || errorHandlers.defaultError
  handler(res, error)
}

export default errorHandler
