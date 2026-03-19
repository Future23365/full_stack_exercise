const express = require('express')
const router = express.Router()
// @ts-ignore
const { Article } = require('../../models')
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
      offset: offset
    }
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`
        }
      }
    }
    const {count, rows} = await Article.findAndCountAll(condition)
    success(res, '文章查询成功', {
      articles: rows,
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
    const article = await getArticle(req)
    success(res, '文章查询成功', article)
  } catch(error) {
    fail(res, error)

  }
})


router.post('/', async function(req, res)  {
  try {
    const body = {
      title: req.body.title,
      content: req.body.content
    }
    const article = await Article.create(body)
    success(res, '文章创建成功', article, 201)
  } catch (error) {
    fail(res, error)


  }
})

router.delete('/:id', async function(req, res) {
  try {
    const article = await getArticle(req)
    await article.destroy()
    success(res, '删除成功')

  } catch(error) {
    fail(res, error)

  }
})

router.put('/:id', async function(req, res) {
  const body = {
    title: req.body.title,
    content: req.body.content
  }
  try {
    const article = await getArticle(req)
    await article.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getArticle(req) {
  const { id } = req.params
  const article = await Article.findByPk(id)
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到`)
  }

  return article
}




module.exports = router
