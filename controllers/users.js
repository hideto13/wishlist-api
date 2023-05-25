const { NODE_ENV, JWT_SECRET, JWT_DEV_SECRET } = require('../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const NotFoundError = require('../errors/NotFound')
const ConflictError = require('../errors/Conflict')

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('id not found')
    })
    .then(user =>
      res.send({
        _id: user._id,
        email: user.email,
      })
    )
    .catch(next)
}

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then(user => {
      if (user) {
        throw new ConflictError('User already exist')
      } else {
        return bcrypt.hash(password, 10)
      }
    })
    .then(hash =>
      User.create({
        email,
        password: hash,
      })
    )
    .then(user =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
      })
    )
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map(error => error.message)
              .join(', ')}`
          )
        )
      } else {
        next(err)
      }
    })
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' }
      )

      res.send({ token })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map(error => error.message)
              .join(', ')}`
          )
        )
      } else {
        next(err)
      }
    })
}
