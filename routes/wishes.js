const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const { getWishes, createWish, deleteWish } = require('../controllers/wishes')

router.get('/', getWishes)

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
        .pattern(
          /https*:\/\/(www.)?([A-Za-z0-9]{1}[A-Za-z0-9-]*\.?)*\.{1}[A-Za-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/
        ),
      link: Joi.string()
        .required()
        .pattern(
          /https*:\/\/(www.)?([A-Za-z0-9]{1}[A-Za-z0-9-]*\.?)*\.{1}[A-Za-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/
        ),
      name: Joi.string().required(),
    }),
  }),
  createWish
)

module.exports = router
