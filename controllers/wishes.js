const Wish = require('../models/wish')
const NotFoundError = require('../errors/NotFound')
const ForbiddenError = require('../errors/Forbidden')
const BadRequestError = require('../errors/BadRequest')

const getWishObj = wish => {
  const obj = {
    description: wish.description,
    image: wish.image,
    link: wish.link,
    name: wish.name,
  }
  return obj
}

module.exports.getWishes = (req, res, next) => {
  Wish.find({})
    .then(wishes => res.send(wishes.map(wish => getWishObj(wish))))
    .catch(next)
}

module.exports.createWish = (req, res, next) => {
  const { description, image, link, name } = req.body

  Wish.create({
    description,
    image,
    link,
    name,
    owner: req.user._id,
  })
    .then(wish => {
      res.send(getWishObj(wish))
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

module.exports.deleteWish = (req, res, next) => {
  Wish.findById(req.params.wishId)
    .orFail(() => {
      throw new NotFoundError('id not found')
    })
    .then(wish => {
      if (!wish.owner.equals(req.user._id)) {
        throw new ForbiddenError('Access denied')
      }
    })
    .then(() =>
      Wish.deleteOne({ _id: req.params.wishId }).then(wish =>
        res.send(getWishObj(wish))
      )
    )
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect id'))
      } else {
        next(err)
      }
    })
}
