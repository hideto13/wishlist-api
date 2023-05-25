const { NODE_ENV, JWT_SECRET, JWT_DEV_SECRET } = require('../config')
const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../errors/Unauthorized')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization needed'))
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET
    )
  } catch (err) {
    return next(new UnauthorizedError('Incorrect token'))
  }

  req.user = payload

  return next()
}
