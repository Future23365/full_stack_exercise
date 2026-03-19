const express = require('express')
const router = express.Router()
// @ts-ignore
const { User } = require('../../models')
const { Op } = require('sequelize')
const { success, fail } = require('../../utils/responses')
const { NotFoundError } = require('../../utils/erros')


router.get('/',async function(req, res) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const condition = {
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
      where: {}
    }
    if (query.user) {
      condition.where.user = {
        [Op.like]: `%${query.user}%`
      }
    }
    if (query.email) {
      condition.where.email = {
        [Op.eq]: `%${query.email}%`
      }
    }
    if (query.nickname) {
      condition.where.nickname = {
        [Op.like]: `%${query.nickname}%`
      }
    }
    if (query.sex) {
      condition.where.sex = {
        [Op.eq]: `%${query.sex}%`
      }
    }
    if (query.username) {
      condition.where.username = {
        [Op.like]: `%${query.username}%`
      }
    }
    const {count, rows} = await User.findAndCountAll(condition)
    success(res, '用户查询成功', {
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })
  } catch (error) {
    fail(res, error)
  }

})

router.get('/:id', async function(req, res) {
  try {
    const user = await getUser(req)
    success(res, '用户查询成功', user)
  } catch(error) {
    fail(res, error)

  }
})


router.post('/', async function(req, res)  {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      role: req.body.role,
      avatar: req.body.avatar
    }
    const user = await User.create(body)
    success(res, '用户创建成功', user, 201)
  } catch (error) {
    fail(res, error)


  }
})

router.delete('/:id', async function(req, res) {
  try {
    const user = await getUser(req)
    await user.destroy()
    success(res, '删除成功')

  } catch(error) {
    fail(res, error)

  }
})

router.put('/:id', async function(req, res) {
  const body = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    role: req.body.role,
    avatar: req.body.avatar
  }
  try {
    const user = await getUser(req)
    await user.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getUser(req) {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到`)
  }

  return user
}




module.exports = router
