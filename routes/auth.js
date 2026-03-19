const express = require('express')
const router = express.Router()
// @ts-ignore
const { User } = require('../models')
const { Op } = require('sequelize')
const { success, fail } = require('../utils/responses')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/erros')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async(req, res) => {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      password: req.body.password,
      sex: 2,
      role: 0
    }

    const user = await User.create(body)
    delete user.dataValues.password
    success(res, '搜索课程成功', { user }, 201)
  } catch(error) {
    fail(res, error)
  }
})


router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body
    if (!login) {
      throw new BadRequestError('邮箱/用户名必须填写')
    }
    if (!password) {
      throw new BadRequestError('密码不能为空')
    }

    const condition = {
      where: {
        [Op.or]: [
          { email: login },
          { username: login }
        ]
      }
    }

    const user = await User.findOne(condition)
    if (!user) {
      throw new NotFoundError('用户不存在')
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedError('密码错误')
    }

    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '30d' })

    success(res, '登录成功', { token })
  } catch(error) {
    fail(res, error)
  }
})


module.exports = router