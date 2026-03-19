const express = require('express')
const router = express.Router()
// @ts-ignore
const { Article, Category, Chapter, User } = require('../models')
const { success, fail } = require('../utils/responses')
const { NotFoundError } = require('../utils/erros')

router.get('/', async(req, res) => {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize


    const condition = {
      attributes: { exclude: ['content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    }

    const { count, rows } = await Article.findAndCountAll(condition)
    success(res, '查询文章列表成功', {
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


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
  const article = await Article.findByPk(id)
  if (!article) {
    throw new NotFoundError(`Id: ${id} 的文章未找到`)
  }

  success(res, '查询文章成功', { article })
  } catch(error) {
    fail(res, error)
  }
})

module.exports = router