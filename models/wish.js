const mongoose = require('mongoose')
const validator = require('validator')

const wishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v)
      },
      message: 'Invalid image link',
    },
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v)
      },
      message: 'Invalid buy link',
    },
  },
  price: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
})

module.exports = mongoose.model('wish', wishSchema)
