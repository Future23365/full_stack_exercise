const express = require('express')
const router = express.Router()
// @ts-ignore
const { Chapter, Course } = require('../../models')
const { Op } = require('sequelize')
const { success, fail } = require('../../utils/responses')
const { NotFoundError } = require('../../utils/erros')

router.get('/',async function(req, res) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    if (!query.courseId) {
      throw new Error('获取章节列表失败，课程id不能为空')
    }

    const condition = {
      order: [['rank', 'ASC'], ['id', 'ASC']],
      limit: pageSize,
      offset: offset,
      ...getCondition(),
      where: {}
    }
    if (query.categoryId) {
      condition.where.categoryId = {
        [Op.eq]: `%${query.categoryId}%`
      }
    }
    if (query.title) {
      condition.where.title = {
        [Op.like]: `%${query.title}%`
      }
    }
    if (query.content) {
      condition.where.content = {
        [Op.like]: `%${query.content}%`
      }
    }
    const {count, rows} = await Chapter.findAndCountAll(condition)
    success(res, '章节查询成功', {
      chapters: rows,
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
    const chapter = await getChapter(req)
    success(res, '章节查询成功', chapter)
  } catch(error) {
    fail(res, error)

  }
})


router.post('/', async function(req, res)  {
  try {
    const body = {
      title: req.body.title,
      content: req.body.content,
      courseId: req.body.courseId,
      video: req.body.video,
      rank: req.body.rank
    }
    const chapter = await Chapter.create(body)
    success(res, '章节创建成功', chapter, 201)
  } catch (error) {
    fail(res, error)


  }
})

router.delete('/:id', async function(req, res) {
  try {
    const chapter = await getChapter(req)
    await chapter.destroy()
    success(res, '删除成功')

  } catch(error) {
    fail(res, error)

  }
})

router.put('/:id', async function(req, res) {
  const body = {
    title: req.body.title,
    content: req.body.content,
    courseId: req.body.courseId,
    video: req.body.video,
    rank: req.body.rank
  }
  try {
    const chapter = await getChapter(req)
    await chapter.update(body)
    success(res, '更新成功')

  } catch(error) {
    fail(res, error)

  }
})


async function getChapter(req) {
  const { id } = req.params
  const chapter = await Chapter.findByPk(id,getCondition())
  if (!chapter) {
    throw new NotFoundError(`ID: ${id}的章节未找到`)
  }

  return chapter
}

function getCondition() {
  const condition = {
    attributes: { exclude: ['CourseId'] },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      },
    ],
  }
  return condition
}


module.exports = router
