require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const { celebrate, errors, Joi } = require('celebrate')
const auth = require('./middlewares/auth')
const { requestLogger, errorLogger } = require('./middlewares/logger')
const { createUser, login } = require('./controllers/users')
const NotFoundError = require('./errors/NotFound')

const { PORT = 3000 } = process.env
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/wishesdb')

app.use(requestLogger)

app.use(cors())

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
)

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
)

app.use('/users', require('./routes/users'))

app.use('/wishes', require('./routes/wishes'))

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Incorrect request'))
})

app.use(errorLogger)

app.use(errors())

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = statusCode === 500 ? 'Server error' : err.message

  res.status(statusCode).send({ message })
  next()
})

app.listen(PORT)
