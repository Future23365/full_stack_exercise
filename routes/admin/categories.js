const express = require('express')
const router = express.Router()
// @ts-ignore
const { Category, Course } = require('../../models')
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
      order: [['rank', 'ASC'], ['id', 'ASC']],
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
    const {count, rows} = await Category.findAndCountAll(condition)
    success(res, '分类查询成功', {
      categories: rows,
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
    const category = await getCategory(req)
    success(res, '分类查询成功', category)
  } catch(error) {
    fail(res, error)

  }
})


router.post('/', async function(req, res)  {
  try {
    const body = {
      name: req.body.name,
      rank: req.body.rank
    }
    const category = await Category.create(body)
    success(res, '分类创建成功', category, 201)
  } catch (error) {
    fail(res, error)


  }
})

router.delete('/:id', async function(req, res) {
  try {
    const category = await getCategory(req)

    const count = await Course.count({
      where: {
        categoryId: req.params.id
      }
    })
    if (count > 0) {
      throw new Error('当前分类有课程数据，无法删除')
    }

    await category.destroy()
    success(res, '删除成功')

  } catch(error) {
    fail(res, error)

  }
})

router.put('/:id', async function(req, res) {
  const body = {
    name: req.body.name,
    rank: req.body.rank
  }
  try {
    const category = await getCategory(req)
    await category.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getCategory(req) {
  const { id } = req.params
  const category = await Category.findByPk(id)
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到`)
  }

  return category
}




module.exports = router
