const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const validator = require('validator')
const {
  getUserWishes,
  createWish,
  deleteWish,
} = require('../controllers/wishes')

router.get('/', getUserWishes)

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteWish
)

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      description: Joi.string(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value
          }
          return helpers.message('Incorrect image')
        }),
      link: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value
          }
          return helpers.message('Incorrect link')
        }),
      name: Joi.string().required(),
      price: Joi.number().required(),
    }),
  }),
  createWish
)

module.exports = router
