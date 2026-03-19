const express = require('express')
const router = express.Router()
// @ts-ignore
const { Course, Category, Chapter, User } = require('../models')
const { Op } = require('sequelize')
const { success, fail } = require('../utils/responses')
const { NotFoundError } = require('../utils/erros')

router.get('/', async(req, res) => {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const condition = {
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      }
    }

    const { count, rows } = await Course.findAndCountAll(condition)
    success(res, '搜索课程成功', {
      course: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })
  } catch(error) {
    fail(res, error)
  }
})


module.exports = router