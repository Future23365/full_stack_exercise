const jwt = require('jsonwebtoken')
// @ts-ignore
const { User } = require('../models')
const { success, fail } = require('../utils/responses')
const { NotFoundError, UnauthorizedError } = require('../utils/erros')

module.exports = async(req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      throw new UnauthorizedError('没有登录')
    }

    const decoded = jwt.verify(token, process.env.SECRET)
    // @ts-ignore
    const { userId } = decoded

    const user = await User.findByPk(userId)
    if (!user) {
      throw new UnauthorizedError('用户不存在')
    }
    if (user.role !== 100) {
      throw new UnauthorizedError('没有权限')
    }

    req.user = user
    next()
  } catch(error) {
    fail(res, error)
  }
}