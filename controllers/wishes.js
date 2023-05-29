const Wish = require('../models/wish')
const NotFoundError = require('../errors/NotFound')
const ForbiddenError = require('../errors/Forbidden')
const BadRequestError = require('../errors/BadRequest')

const getWishObj = wish => {
  const obj = {
    _id: wish._id,
    description: wish.description,
    image: wish.image,
    link: wish.link,
    name: wish.name,
    owner: wish.owner,
    price: wish.price,
  }
  return obj
}

module.exports.getUserWishes = (req, res, next) => {
  Wish.find({ owner: req.user._id })
    .then(wishes => res.send(wishes.map(wish => getWishObj(wish))))
    .catch(next)
}

module.exports.createWish = (req, res, next) => {
  const { description, image, link, name, price } = req.body

  Wish.create({
    description,
    image,
    link,
    name,
    price,
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
  Wish.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('id not found')
    })
    .then(wish => {
      if (!wish.owner.equals(req.user._id)) {
        throw new ForbiddenError('Access denied')
      }
    })
    .then(() =>
      Wish.deleteOne({ _id: req.params._id }).then(wish =>
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
