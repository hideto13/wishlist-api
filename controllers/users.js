const User = require('../models/user')
const NotFoundError = require('../errors/NotFound')

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
