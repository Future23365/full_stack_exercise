const express = require('express')
const router = express.Router()
// @ts-ignore
const { Course, Category, User, Chapter } = require('../../models')
const { Op } = require('sequelize')
const { success, fail } = require('../../utils/responses')
const { NotFoundError } = require('../../utils/erros')

const { includes } = require('lodash')

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
      where: {},
      ...getCondition()
    }
    if (query.categoryId) {
      condition.where.categoryId = {
        [Op.eq]: `%${query.categoryId}%`
      }
    }
    if (query.userId) {
      condition.where.userId = {
        [Op.eq]: `%${query.userId}%`
      }
    }
    if (query.name) {
      condition.where.name = {
        [Op.like]: `%${query.name}%`
      }
    }
    if (query.recommended) {
      condition.where.recommended = {
        [Op.eq]: query.recommended === 'true'
      }
    }
    if (query.introductory) {
      condition.where.introductory = {
        [Op.like]: query.introductory === 'true'
      }
    }
    const {count, rows} = await Course.findAndCountAll(condition)
    success(res, '课程查询成功', {
      courses: rows,
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
    const course = await getCourse(req)
    success(res, '课程查询成功', course)
  } catch(error) {
    fail(res, error)

  }
})


router.post('/', async function(req, res)  {
  try {
    const body = {
      categoryId: req.body.categoryId,
      userId: req.user.id,
      name: req.body.name,
      image: req.body.image,
      recommended: req.body.recommended,
      introductory: req.body.introductory,
      content: req.body.content,
      likesCount: req.body.linesCount,
      chaptersCount: req.body.chaptersCount
    }
    const course = await Course.create(body)
    success(res, '课程创建成功', course, 201)
  } catch (error) {
    fail(res, error)


  }
})

router.delete('/:id', async function(req, res) {
  try {
    const course = await getCourse(req)
    const count = await Chapter.count({
      where: {
        courseId: req.params.id
      }
    })
    if(count > 0) {
      throw new Error('当前课程有章节，无法删除')
    }
    await course.destroy()
    success(res, '删除成功')

  } catch(error) {
    fail(res, error)

  }
})

router.put('/:id', async function(req, res) {
  const body = {
    categoryId: req.body.categoryId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
    likesCount: req.body.linesCount,
    chaptersCount: req.body.chaptersCount
  }
  try {
    const course = await getCourse(req)
    await course.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getCourse(req) {
  const { id } = req.params
  
  const course = await Course.findByPk(id, getCondition())
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到`)
  }

  return course
}

function getCondition() {
  const condition = {
    attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ],
  }
  return condition
}





module.exports = router
