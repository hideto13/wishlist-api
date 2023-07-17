require('dotenv').config()
const express = require('express')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const { errors } = require('celebrate')
const auth = require('./middlewares/auth')
const { requestLogger, errorLogger } = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')
const { MONGO_DATA_BASE, PORT } = require('./config')
const NotFoundError = require('./errors/NotFound')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(MONGO_DATA_BASE)

app.use(requestLogger)

app.use(cors())
app.use(fileUpload())

app.use(require('./routes'))

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Incorrect request'))
})

app.use(errorLogger)

app.use(errors())

app.use(errorHandler)

app.listen(PORT)
