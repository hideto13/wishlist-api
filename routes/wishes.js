const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const auth = require('../middlewares/auth')
const validator = require('validator')
const {
  getUserWishes,
  createWish,
  deleteWish,
  getUserWishesById,
  editWish,
} = require('../controllers/wishes')

router.get('/', auth, getUserWishes)

router.get(
  '/:_userId',
  celebrate({
    params: Joi.object().keys({
      _userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserWishesById
)

router.delete(
  '/:_id',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteWish
)

router.patch(
  '/:_id',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
    body: Joi.object().keys({
      description: Joi.string(),
      image: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value
        }
        return helpers.message('Incorrect image')
      }),
      link: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value
        }
        return helpers.message('Incorrect link')
      }),
      name: Joi.string(),
      price: Joi.number(),
    }),
  }),
  editWish
)

router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      description: Joi.string(),
      image: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value
        }
        return helpers.message('Incorrect image')
      }),
      imageBN:Joi.any(), 
      link: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value
        }
        return helpers.message('Incorrect link')
      }),
      name: Joi.string().required(),
      price: Joi.number(),
    }),
  }),
  createWish
)

module.exports = router
